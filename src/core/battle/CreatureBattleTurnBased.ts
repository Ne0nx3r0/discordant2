import Creature from '../creature/Creature';
import { IGetRandomClientFunc } from '../../gameserver/socket/SocketServer';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import ItemUsable from '../item/ItemUsable';
import WeaponAttack from '../item/WeaponAttack';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import { getDamagesLine } from '../../bot/util/ChatHelpers';
import SendMessageClientRequest from '../../client/requests/SendMessageClientRequest';
import WeaponAttackStep from '../item/WeaponAttackStep';
import BattleTemporaryEffect from '../effects/BattleTemporaryEffect';
import { SocketCreature } from '../creature/Creature';
import { IWeaponAttackDamages, DamageType } from '../item/WeaponAttackStep';
import { GetDodgePercent } from '../../util/GetDodgePercent';

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
    queuedBattleMessages: Array<Array<string>>;

    constructor(bag:CreatureBattleTurnBasedBag){
        this.queueBattleMessage = this.queueBattleMessage.bind(this);
        this.queuedBattleMessages = [];
        this.channelId = bag.channelId;
        this.getClient = bag.getClient;
        this.battleCleanup = bag.battleCleanup;
        this.runChance = bag.runChance;
        
        this.battleHasEnded = false;
        
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
                        sendBattleEmbed: this.queueBattleMessage,
                        battle: this,
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

        this.flushBattleMessagesCheck();

        if(this.activeTeam == 1){
            function formatbc(bc:IBattleCreature){
                const blocking = bc.blocking ? ' | Blocking' : '';
                const charges = bc.charges>0?' | Charges: '+bc.charges:'';
                let exhausted = '';
                let defeated = '';
                const prefix = bc.defeated ? '- ' : '+ ';
                const creatureTitle = bc.creature.title+' '+bc.creature.hpCurrent+'/'+bc.creature.stats.hpTotal;

                if(bc.creature.id == -1){
                    exhausted = bc.exhausted ? ' | Exhausted' : '';
                }

                return prefix+creatureTitle+charges+blocking+exhausted;
            }

            const team1Msg = this.participants
            .filter(function(bc){
                return bc.teamNumber == 1;
            })
            .map(formatbc)
            .join('\n');

            const team2Msg = this.participants
            .filter(function(bc){
                return bc.teamNumber == 2;
            })
            .map(formatbc)
            .join(', ');

            this.queueBattleMessage([
                '--- YOUR MOVE ---',
                team1Msg,
                '',
                team2Msg
            ]);
        }

        this.runAIActions();

        this.flushBattleMessagesCheck();
    }

    exhaustParticipant(bc:IBattleCreature){
        bc.exhausted = true;

        let teamExhausted = true;

        this.participants.forEach(function(p){
            if(!p.defeated && !p.exhausted && p.teamNumber == bc.teamNumber){
                teamExhausted = false;
            }
        });

        if(teamExhausted){
            this.activeTeam = this.activeTeam == 1 ? 2 : 1;

            this.turnBegin();
        }

        this.flushBattleMessagesCheck();
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
                    this.queueBattleMessage([`${p.creature.title} is exhausted!`]);

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

        for(var i=0;i<this.participants.length;i++){
            const participant = this.participants[i];

            if(participant.teamNumber != bc.teamNumber 
            && !participant.defeated
            && participant.creature instanceof CreatureAIControlled){
                const aiParticipant = participant.creature as CreatureAIControlled;

                if(!aiParticipant.allowRun){
                    throw `You can't run from ${participant.creature.title}`;
                }
            }
        }

        if(Math.random() < this.runChance){
            const partyMembers = this.participants
            .filter(function(p){
                return p.teamNumber == bc.teamNumber;
            })
            .map(function(p){
                return p.creature.title;
            }).join(', ');
            
            this.queueBattleMessage([`+ ${partyMembers} ran away!`]);

            this.flushBattleMessages();

            this.endBattle(BattleResult.Ran);
        }
        else{
            this.queueBattleMessage([`- Failed to run away!`]);

            this.exhaustParticipant(bc);
        }
    }

    playerActionSkip(requester:PlayerCharacter,skip:PlayerCharacter){
        if(requester == skip){
            const bc = this.getBattleCreatureForAction(requester);

            this.queueBattleMessage([`${bc.creature.title} skips their turn`]);

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

            this.queueBattleMessage([`${bc.creature.title} has been skipped`]);

            this.exhaustParticipant(bc);
        }
    }

    playerActionUseItem(pc:PlayerCharacter,target:PlayerCharacter,item:ItemUsable){
        const bc = this.getBattleCreatureForAction(pc);

        const onUseMsg = item.onUse(pc,target);

        this.queueBattleMessage([
            `${pc.title} used ${item.title}`,
            '+ '+onUseMsg
        ]);

        this.exhaustParticipant(bc);
    }

    playerActionBlock(pc:PlayerCharacter){
        const bc = this.getBattleCreatureForAction(pc);

        if(bc.blocking){
            throw 'You are already blocking';
        }

        bc.blocking = true;

        this.queueBattleMessage([`+ ${bc.creature.title} blocks!`]);
        
        this.exhaustParticipant(bc);
    }

    playerActionAttack(attacker:Creature,attack:WeaponAttack,target:Creature){
        const bca = this.getBattleCreatureForAction(attacker);
        
        if(attack.chargesRequired > bca.charges){
            throw 'You need at least '+attack.chargesRequired+' charges to use '+attack.title;
        }

        let bcTarget:IBattleCreature;

        if(target != attacker){
            bcTarget = this.participantsLookup.get(target);

            if(!bcTarget){
                throw 'Invalid target '+target.title;
            }
            else if(attack.isFriendly && bcTarget.teamNumber != bca.teamNumber){
                throw target.title+' is not on your team and that is a friendly attack';
            }
            else if(!attack.isFriendly && bcTarget.teamNumber == bca.teamNumber){
                throw target.title+' is on your team and that\'s not a friendly attack';
            }
        } 
        else if(attack.isFriendly){
            bcTarget = bca;
        }
        else{// if(!attack.isFriendly){
            const survivingEnemies = [];

            this.participants.forEach(function(bc){
                if(!bc.defeated && bc.teamNumber != bca.teamNumber){
                    for(var i=0;i<bc.creature.stats.redEye;i++){
                        survivingEnemies.push(bc);
                    }
                }
            });

            bcTarget = survivingEnemies[Math.floor(survivingEnemies.length * Math.random())];
        }   

        bca.charges -= attack.chargesRequired;

        this._creatureAttack(bca,attack,bcTarget);

        this.exhaustParticipant(bca);
    }

    playerActionCharge(pc:PlayerCharacter){
        const bc = this.getBattleCreatureForAction(pc);

        bc.charges++;

        this.queueBattleMessage([`+ ${bc.creature.title} collects ambient energy (${bc.charges} total)`]);

        this.exhaustParticipant(bc);
    }

    getBattleCreatureForAction(creature:Creature):IBattleCreature{
        if(this.battleHasEnded){
            throw `The battle has ended`;
        }

        const bc = this.participantsLookup.get(creature);

        if(!bc){
            throw 'You are not in this battle';
        }

        if(bc.exhausted){
            const lazyTeamMembers = this.getLazyTeamMemberNames(bc.teamNumber);

            if(lazyTeamMembers.length > 0){
                throw 'You are exhausted, waiting on: '+lazyTeamMembers.join(', ')+' to complete their turn';
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

        const damages:Array<IWeaponAttackDamages> = queuedAttackStep.step.getDamages({
            attacker: attacker,
            defender: defender,
            battle: this,
            step: queuedAttackStep.step,
            isCritical: isCritical,
        });

        const criticalMsg = isCritical ? '**CRITICAL HIT** ' : '';

        const damagesMsgs = [];
        const defeatedParticipants = [];

        damages.forEach((wad:IWeaponAttackDamages)=>{
            const wadc = wad.target.creature;

            if(this.battleHasEnded){
                return;
            }

            if(wad.type == DamageType.special){
                //nothing to do here but we don't want to exit yet because we need to run a defeated check
            }
            else if(wad.type == DamageType.healing){
                wad.target.creature.hpCurrent += Math.round(wad.amount);
    
                damagesMsgs.push(
                    `+ ${wadc.title}(${wadc.hpCurrent}/${wadc.stats.hpTotal}) gained ${wad.amount}HP`
                );
            }
            else{
                //check if they dodged the attack
                const scalingAttribute = queuedAttackStep.step.attack.scalingAttribute;

                const attackerStat = attacker.creature.stats[scalingAttribute];
                const defenderAgility = wad.target.creature.stats.agility;

                const dodge = GetDodgePercent(attackerStat,defenderAgility);

                if(Math.random() < dodge){
                    damagesMsgs.push(
                        `+ ${wadc.title} DODGED the attack!`
                    );
                }
                else{
                    const damageTypeStr = DamageType[wad.type];
                    
                    const resistance = wad.target.creature.stats.resistances[damageTypeStr];
                    
                    let damageTaken = wad.amount - resistance;
                    let minDamage = wad.amount * 0.2;

                    if(damageTaken < minDamage){
                        damageTaken = minDamage;
                    }

                    damageTaken = Math.round(damageTaken);

                    const damageResisted = wad.amount - damageTaken;

                    const resistedStr = damageResisted == 0 ? '' : `, resisted ${damageResisted}`;

                    wad.target.creature.hpCurrent -= damageTaken;

                    damagesMsgs.push(
                        `- ${wadc.title} (${wadc.hpCurrent}/${wadc.stats.hpTotal}) took ${damageTaken} ${damageTypeStr.toUpperCase()} damage${resistedStr}`
                    );
                }
            }
 
            if(wad.target.creature.hpCurrent < 1 && defeatedParticipants.indexOf(wad.target) == -1){
                defeatedParticipants.push(wad.target);
            }
        });
        
        this.queueBattleMessage([
            criticalMsg+queuedAttackStep.step.attackMessage
            .replace('{defender}',`${defender.creature.title} (${defender.creature.hpCurrent}/${defender.creature.stats.hpTotal})`)
            .replace('{attacker}',`${attacker.creature.title} (${attacker.creature.hpCurrent}/${attacker.creature.stats.hpTotal})`)
        ].concat(damagesMsgs));

        defeatedParticipants.forEach((dp)=>{
            this.participantDefeated(dp);
        });
    }

    participantDefeated(participant:IBattleCreature){
        if(this.battleHasEnded){
            return;
        }

        participant.defeated = true;
        participant.blocking = false;
        participant.charges = 0;
        participant.queuedAttackSteps.length = 0;
        participant.exhausted = false;
        participant.creature.clearTemporaryEffects();

        this.queueBattleMessage([participant.creature.title +' was defeated!']);

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
        this.flushBattleMessages();

        this.battleHasEnded = true;

        this.participants.forEach(function(p){
            if(p.creature instanceof PlayerCharacter){
                p.creature.battle = null;
                p.creature.clearTemporaryEffects();

                //If anyone passed out restore them to 5% of their HP
                if(p.creature.hpCurrent < 0){
                    p.creature.hpCurrent = Math.round(p.creature.stats.hpTotal * 0.05);
                }
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
                sendBattleEmbed: this.queueBattleMessage,
                battle: this,
            });
        }
    }

    removeTemporaryEffect(target:Creature,effect:BattleTemporaryEffect){
        if(effect.onRemoved){
            effect.onRemoved({
                target:target,
                sendBattleEmbed: this.queueBattleMessage,
                battle: this,
            });
        }

        target.removeTemporaryEffect(effect);
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

    revive(creature:Creature,hpAmount:number){
        const bc = this.participantsLookup.get(creature);

        if(!bc.defeated){
            throw `${creature.title} has not been defeated yet!`;
        }

        bc.defeated = false;
        bc.creature.hpCurrent = Math.min(hpAmount,bc.creature.stats.hpTotal);
    }

    queueBattleMessage(msg:Array<string>){
        this.queuedBattleMessages.push(msg);
    }

    flushBattleMessagesCheck(){
        if(this.queuedBattleMessages.length == 0){
            return;
        }

        for(var i=0;i<this.participants.length;i++){
            const p = this.participants[i];

            if(p.teamNumber == this.activeTeam  
            && !p.defeated 
            && !p.exhausted
            && p.creature instanceof PlayerCharacter){
                this.flushBattleMessages();
            }
        }
    }

    flushBattleMessages(){   
        if(this.queuedBattleMessages.length == 0){
            return;
        }

        const msgToSend = this.queuedBattleMessages.map(function(block){
            return '```diff\n'+block.join('\n')+'\n```';
        }).join('\n');

        new SendMessageClientRequest({
            channelId: this.channelId,
            message: msgToSend,
        }).send(this.getClient());

        this.queuedBattleMessages = [];
    }
}