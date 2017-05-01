import Creature from '../creature/Creature';
import { IGetRandomClientFunc } from '../../gameserver/socket/SocketServer';
import EffectMessageClientRequest from '../../client/requests/EffectMessageClientRequest';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import ItemUsable from '../item/ItemUsable';
import WeaponAttack from '../item/WeaponAttack';
import RoundBeginClientRequest from '../../client/requests/RoundBeginClientRequest';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import { EMBED_COLORS } from '../../bot/util/ChatHelpers';
import IDamageSet from '../damage/IDamageSet';
import { DamagesTotal } from '../damage/IDamageSet';
import AttackedClientRequest from '../../client/requests/AttackedClientRequest';
import SendMessageClientRequest from '../../client/requests/SendMessageClientRequest';
import WeaponAttackStep from '../item/WeaponAttackStep';
import BlockedClientRequest from '../../client/requests/BlockedClientRequest';
import ChargedClientRequest from '../../client/requests/ChargedClientRequest';
import BattleTemporaryEffect from '../effects/BattleTemporaryEffect';
import { SocketCreature } from '../creature/Creature';

export enum BattleResult{
    Team1Won,
    Team2Won,
    Expired,
    Ran
}

export interface CreatureBattleTurnBasedBag{
    channelId:string;
    team1:Array<Creature>;
    team2:Array<Creature>;
    getClient:IGetRandomClientFunc;
    battleCleanup:BattleCleanupFunc;
    startDelay:number;
    runChance:number;
}

export interface IBattleCreature{
    creature:Creature;
    blocking:boolean;
    defeated:boolean;
    exhausted:boolean;
    charges:number;
    teamNumber: number;
    queuedAttackSteps:Array<BattleCreatureAttackStep>;
}

interface BattleCreatureAttackStep{
    step: WeaponAttackStep;
    target: IBattleCreature;
}

export interface BattleCleanupFunc{
    (bag:IPostBattleBag):void;
}

export interface IPostBattleBag{
    result: BattleResult;
    survivors: Array<PlayerCharacter>;
}

export interface ISocketBattleCreature{
    creature:SocketCreature;
    blocking:boolean;
    defeated:boolean;
    exhausted:boolean;
    charges:number;
    teamNumber: number;
}

export default class CreatureBattleTurnBased{
    channelId:string;
    getClient:IGetRandomClientFunc;
    battleHasEnded: boolean;
    battleCleanup: BattleCleanupFunc;
    participants: Array<IBattleCreature>;
    participantsLookup: Map<Creature,IBattleCreature>;
    activeTeam: number;
    runChance: number;

    constructor(bag:CreatureBattleTurnBasedBag){
        this.channelId = bag.channelId;
        this.getClient = bag.getClient;
        this.battleCleanup = bag.battleCleanup;
        this.runChance = bag.runChance;
        
        this.battleHasEnded = false;

        this.sendEmbed = this.sendEmbed.bind(this);
        
        this.participants = [];
        this.participantsLookup = new Map();

        const addParticipant = (creature:Creature,teamNumber:number)=>{
            if(creature instanceof PlayerCharacter){
                const pc:PlayerCharacter = creature;

                pc.status = 'inBattle';
                pc.battle = this;
            }

            const participant = {
                creature:creature,
                blocking:false,
                defeated:false,
                exhausted:true,//can't attack until first round
                charges:0,
                teamNumber:teamNumber,
                queuedAttackSteps:[],
            };

            this.participants.push(participant);
            this.participantsLookup.set(creature,participant);
        }

        bag.team1.forEach((c)=>{
            addParticipant(c,1);
        });

        bag.team2.forEach((c)=>{
            addParticipant(c,2);
        });

        this.activeTeam = 2;

        setTimeout(()=>{
            this.turnBegin();
        },bag.startDelay);
    }
    
    turnBegin(){
// Run any onRoundBegin effects
        for(var i=0;i<this.participants.length;i++){
            const p = this.participants[i];

            if(p.teamNumber != this.activeTeam){
                continue;
            }

            if(p.defeated){
                continue;
            }

            p.exhausted = false;

            p.creature.tempEffects.forEach((roundsLeft,effect)=>{
                if(p.defeated){
                    return;
                }
                
                if(effect.onRoundBegin && !this.battleHasEnded){
                    effect.onRoundBegin({
                        target: p.creature,
                        sendBattleEmbed: this.sendEmbed
                    });

                    if(p.creature.hpCurrent<1){
                        this.participantDefeated(p);
                    }
                }

// Decrement//remove effect
                if(roundsLeft==1){
                    this.removeTemporaryEffect(p.creature,effect);
                }
                else{
                    p.creature.tempEffects.set(effect,roundsLeft-1);
                }
            });

            if(this.battleHasEnded){
                return;
            }
        }

        if(this.activeTeam == 1){
            new RoundBeginClientRequest({
                channelId: this.channelId,
                participants: this.participants.map(function(bc){
                    return {
                        creature: bc.creature.toSocket(),
                        blocking: bc.blocking,
                        defeated: bc.defeated,
                        exhausted: bc.exhausted,
                        charges: bc.charges,
                        teamNumber: bc.teamNumber,
                    };
                }),
            })
            .send(this.getClient());
        }

        this.runAIActions();
    }

    exhaustParticipant(bc:IBattleCreature){
        bc.exhausted = true;

        let teamExhausted = true;

        this.participants.forEach(function(p){
            if(!p.exhausted && p.teamNumber == bc.teamNumber){
                teamExhausted = false;
            }
        });

        if(teamExhausted){
            this.activeTeam = this.activeTeam == 1 ? 2 : 1;

            this.turnBegin();
        }
    }

    runAIActions(){
        this.participants.forEach((p)=>{
            if(this.battleHasEnded){
                return;
            }
            
            if(p.teamNumber == this.activeTeam && p.creature instanceof CreatureAIControlled){
                if(!p.exhausted){
                    const opponents = [];

                    this.participants.forEach(function(opponent){
                        if(!opponent.defeated && opponent.teamNumber != p.teamNumber){
                            opponents.push(opponent);
                        }
                    });

                    if(opponents.length > 0){
                        const randomAttack = p.creature.getRandomAttack();
                        const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

                        this._creatureAttack(p,randomAttack,randomOpponent);

                        this.exhaustParticipant(p);
                    }
                }
                else if(p.queuedAttackSteps.length > 0){
                    this._sendNextAttackStep(p);
                }
                else{
                    this.sendEmbed(`${p.creature.title} is exhausted!`,EMBED_COLORS.INFO);

                    this.exhaustParticipant(p);
                }
            }
        });
    }

    playerActionRun(pc:PlayerCharacter){
        if(!pc.isPartyLeader){
            throw 'Only the party leader can run from a battle';
        }

        const bc = this.getBattleCreatureForAction(pc);

        if(Math.random() < this.runChance){
            const partyMembers = this.participants
            .filter(function(p){
                return p.teamNumber == bc.teamNumber;
            })
            .map(function(p){
                return p.creature.title;
            }).join(', ');
            
            this.sendEmbed(`${partyMembers} ran away!`);

            this.endBattle(BattleResult.Ran);
        }
        else{
            this.sendEmbed(`Failed to run away!`);

            this.exhaustParticipant(bc);
        }
    }

    playerActionSkip(requester:PlayerCharacter,skip:PlayerCharacter){
        if(requester == skip){
            const bc = this.getBattleCreatureForAction(requester);

            this.sendEmbed(`${bc.creature.title} skips their turn`);

            this.exhaustParticipant(bc);
        }
        else{
            if(!requester.isPartyLeader){
                throw 'Only the party leader can skip other players';
            }

            const requesterBc = this.participantsLookup.get(requester);

            if(!requesterBc){
                throw 'You are not in this battle';
            }

            const bc = this.participantsLookup.get(skip);

            if(!bc){
                throw `${bc.creature.title} is not in this battle`;
            }
            
            if(bc.teamNumber != requesterBc.teamNumber){
                throw `${bc.creature.title} is not on your team!`;
            }

            if(bc.exhausted){
                const lazyTeamMembers = this.getLazyTeamMemberNames(bc.teamNumber);
                
                if(lazyTeamMembers.length > 0){
                    throw `${bc.creature.title} has already taken their turn, waiting on: ${lazyTeamMembers.join(', ')}`;
                }

                throw `${bc.creature.title} has already taken their turn`;
            }

            this.exhaustParticipant(bc);

            this.sendEmbed(`${bc.creature.title} has been skipped`);
        }
    }

    playerActionUseItem(pc:PlayerCharacter,item:ItemUsable){
        const bc = this.getBattleCreatureForAction(pc);

        this.exhaustParticipant(bc);
    }

    playerActionBlock(pc:PlayerCharacter){
        const bc = this.getBattleCreatureForAction(pc);

        if(bc.blocking){
            throw 'You are already blocking';
        }

        bc.blocking = true;

        new BlockedClientRequest({
            channelId: this.channelId,
            blockerTitle: bc.creature.title
        })
        .send(this.getClient());
        
        this.exhaustParticipant(bc);
    }

    playerActionAttack(attacker:Creature,attack:WeaponAttack,defender:Creature){
        const bca = this.getBattleCreatureForAction(attacker);
        
        if(attack.chargesRequired > bca.charges){
            throw 'You need at least '+attack.chargesRequired+' charges to use '+attack.title+'!';
        }

        let bcTarget;

        if(defender){
            bcTarget = this.participantsLookup.get(defender);

            if(!bcTarget){
                throw 'Invalid target '+defender.title;
            }
        }
        else if(attack.isFriendly){
            const survivingFriends = [];

            this.participants.forEach(function(bc){
                if(!bc.defeated && bc.teamNumber == bca.teamNumber){
                    survivingFriends.push(bc);
                }
            });

            bcTarget = survivingFriends[Math.floor(survivingFriends.length * Math.random())];
        }
        else{// if(!attack.isFriendly){
            const survivingEnemies = [];

            this.participants.forEach(function(bc){
                if(!bc.defeated && bc.teamNumber != bca.teamNumber){
                    survivingEnemies.push(bc);
                }
            });

            bcTarget = survivingEnemies[Math.floor(survivingEnemies.length * Math.random())];
        }   

        this._creatureAttack(bca,attack,bcTarget);

        this.exhaustParticipant(bca);

        bca.charges -= attack.chargesRequired;
    }

    playerActionCharge(pc:PlayerCharacter){
        const bc = this.getBattleCreatureForAction(pc);

        bc.charges++;

        new ChargedClientRequest({
            channelId: this.channelId,
            chargerTitle: bc.creature.title,
            total: bc.charges,
        })
        .send(this.getClient());

        this.exhaustParticipant(bc);
    }

    getBattleCreatureForAction(creature:Creature):IBattleCreature{
        const bc = this.participantsLookup.get(creature);

        if(!bc){
            throw 'You are not in this battle';
        }

        if(bc.exhausted){
            const lazyTeamMembers = this.getLazyTeamMemberNames(bc.teamNumber);

            if(lazyTeamMembers.length > 0){
                throw 'You are exhausted, waiting on: '+lazyTeamMembers.join(', ');
            }

            throw `You are exhausted`;
        }
        
        if(bc.defeated){
            throw 'You have already been defeated';
        }

        return bc;
    }

    _creatureAttack(attacker:IBattleCreature,attack:WeaponAttack,defender:IBattleCreature){
        //Queue all steps for this attack against the target
        attack.steps.forEach(function(step){
            attacker.queuedAttackSteps.push({
                step: step,
                target: defender,
            });
        });

        // Send the first step now, save the rest for later
        this._sendNextAttackStep(attacker);
    }

    _sendNextAttackStep(attacker:IBattleCreature){
        if(attacker.blocking){
            attacker.blocking = false;
        }

        const queuedAttackStep = attacker.queuedAttackSteps.shift();
        const defender = queuedAttackStep.target;
        const criticalChance = queuedAttackStep.step.attack.weapon.chanceToCritical;
        const isCritical = Math.random() < criticalChance;

        const damages:IDamageSet = queuedAttackStep.step.getDamages({
            attacker: attacker,
            defender: defender,
            battle: this,
            step: queuedAttackStep.step,
            isCritical: isCritical,
        });

        let attackCancelled = false;

        attacker.creature.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttack && !effect.onAttack({
                target: attacker.creature,
                sendBattleEmbed: this.sendEmbed
            }, damages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }

        defender.creature.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttacked && !effect.onAttacked({
                target: defender.creature,
                sendBattleEmbed: this.sendEmbed
            }, damages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }        

        defender.creature.hpCurrent -= Math.round(DamagesTotal(damages));

        new AttackedClientRequest({
            channelId: this.channelId,
            attacker: attacker.creature.toSocket(), 
            isCritical: isCritical,           
            attacked: [{
                creature: defender.creature.toSocket(),
                damages: damages,
                blocked: false,
                exhaustion: 0,
            }],
            message: queuedAttackStep.step.attackMessage
                .replace('{defender}',`${defender.creature.title} (${defender.creature.hpCurrent}/${defender.creature.stats.hpTotal})`)
                .replace('{attacker}',`${attacker.creature.title} (${attacker.creature.hpCurrent}/${attacker.creature.stats.hpTotal})`),
        })
        .send(this.getClient());

        if(defender.creature.hpCurrent < 1){
            this.participantDefeated(defender);
        }
    }

    participantDefeated(participant:IBattleCreature){
        participant.defeated = true;
        participant.blocking = false;
        participant.charges = 0;
        participant.queuedAttackSteps.length = 0;
        participant.exhausted = false;
        participant.creature.clearTemporaryEffects();

        this.sendEmbed(
            participant.creature.title +' was defeated!',
            EMBED_COLORS.INFO
        );

        let teamDefeated = true;

        this.participants.forEach(function(p){
            if(!p.defeated && p.teamNumber == participant.teamNumber){
                teamDefeated = false;
            }
        });

        if(teamDefeated){
            this.endBattle(participant.teamNumber == 2 ? BattleResult.Team1Won : BattleResult.Team2Won);
        }
    }
    
    endBattle(result:BattleResult){
        this.battleHasEnded = true;

        this.participants.forEach(function(p){
            if(p.creature instanceof PlayerCharacter){
                p.creature.battle = null;
                p.creature.clearTemporaryEffects();
            }
        });

        let survivors;

        if(result != BattleResult.Expired){
            const winningTeam = result == BattleResult.Team1Won ? 1 : 2;

            survivors = this.participants.filter(function(p){
                return !p.defeated && p.teamNumber == winningTeam;
            })
            .map(function(bc){
                return bc.creature;
            });
        }
        
        this.battleCleanup({
            result: result,
            survivors: survivors
        });
    }

    addTemporaryEffect(target:Creature,effect:BattleTemporaryEffect,rounds:number){
        target.addTemporaryEffect(effect,rounds);

        if(effect.onAdded){
            effect.onAdded({
                target: target,
                sendBattleEmbed: this.sendEmbed
            });
        }
    }

    removeTemporaryEffect(target:Creature,effect:BattleTemporaryEffect){
        if(effect.onRemoved){
            effect.onRemoved({
                target:target,
                sendBattleEmbed:this.sendEmbed
            });
        }

        target.removeTemporaryEffect(effect);
    }

    sendEmbed(msg:string,color?:number){
        if(!color){
            color = EMBED_COLORS.ACTION;
        }

        const request = new EffectMessageClientRequest({
            channelId: this.channelId,
            msg: msg,
            color: color,
        });

        request.send(this.getClient());
    }

    getLazyTeamMemberNames(team:number):Array<string>{
        const lazyTeamMembers:Array<IBattleCreature> = [];

        this.participants.forEach(function(p){
            if(!p.defeated && !p.exhausted && p.teamNumber == team){
                lazyTeamMembers.push(p);
            }
        });

        if(lazyTeamMembers.length > 0){
            return lazyTeamMembers.map(function(p){
                return p.creature.title;
            });
        }

        return [];
    }
}