import Creature from "../creature/Creature";
import { IGetRandomClientFunc } from "../../gameserver/socket/SocketServer";
import { IRemoveBattleFunc } from "../../gameserver/game/Game";
import PlayerCharacter from '../creature/player/PlayerCharacter';
import ItemUsable from "../item/ItemUsable";
import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from "../item/WeaponAttackStep";
import BlockedClientRequest from "../../client/requests/BlockedClientRequest";
import ChargedClientRequest from "../../client/requests/ChargedClientRequest";
import IDamageSet from '../damage/IDamageSet';
import BattleTemporaryEffect from "../effects/BattleTemporaryEffect";
import EffectMessageClientRequest from "../../client/requests/EffectMessageClientRequest";
import { DamagesTotal } from '../damage/IDamageSet';
import AttackedClientRequest from "../../client/requests/AttackedClientRequest";
import RoundBeginClientRequest from "../../client/requests/RoundBeginClientRequest";
import { SocketCreature } from '../creature/Creature';
import CreatureAIControlled from '../creature/CreatureAIControlled';

interface BattleCreatureAttackStep{
    step: WeaponAttackStep;
    target: IBattleCreature;
}

export interface IBattleCreature{
    creature:Creature;
    blocking:boolean;
    defeated:boolean;
    exhaustion:number;
    charges:number;
    teamNumber: number;
    queuedAttackSteps:Array<BattleCreatureAttackStep>;
}

export interface ISocketBattleCreature{
    creature:SocketCreature;
    blocking:boolean;
    defeated:boolean;
    exhaustion:number;
    charges:number;
    teamNumber: number;
}

export interface IPostBattleBag{
    result:BattleResult;
    wishesEarned:Array<{player:PlayerCharacter,amount:number}>;
}

export interface BattleCleanupFunc{
    (bag:IPostBattleBag):void;
}

interface CreatureBattleBag {
    channelId:string;
    team1:Array<Creature>;
    team2:Array<Creature>;
    getClient:IGetRandomClientFunc;
    battleCleanup:BattleCleanupFunc;
}

export enum BattleResult{
    Team1Won,
    Team2Won,
    Expired
}

const INACTIVE_ROUNDS_BEFORE_CANCEL_BATTLE = 10;
const ATTACK_TICK_MS = 10000;

export default class CreatureBattle{
    channelId:string;
    getClient: IGetRandomClientFunc;
    lastActionRoundsAgo: number;
    battleHasEnded: boolean;
    battleCleanup: BattleCleanupFunc;
    participants: Array<IBattleCreature>;
    participantsLookup: Map<Creature,IBattleCreature>;

    constructor(bag:CreatureBattleBag){
        this.lastActionRoundsAgo = 0;
        this.channelId = bag.channelId;

        this.getClient = bag.getClient;

        this.battleHasEnded = false;

        this.sendEffectApplied = this.sendEffectApplied.bind(this);
        
        this.participants = [];
        this.participantsLookup = new Map();

        const addParticipant = (creature:Creature,teamNumber:number)=>{
            this.participantsLookup.set(creature,{
                creature:creature,
                blocking:false,
                defeated:false,
                exhaustion:1,//can't attack until first round
                charges:0,
                teamNumber:teamNumber,
                queuedAttackSteps:[],
            });
        }

        bag.team1.forEach((c)=>{
            addParticipant(c,1);
        });

        bag.team2.forEach((c)=>{
            addParticipant(c,2);
        });

        setTimeout(this._roundTick.bind(this),ATTACK_TICK_MS);
    }

    _roundTick(){
// Check if battle ended or has become inactive
        if(this.battleHasEnded){
            return;
        }

        if(this.lastActionRoundsAgo >= INACTIVE_ROUNDS_BEFORE_CANCEL_BATTLE){
            this.endBattle(BattleResult.Expired);

            return;
        }
        
        this.lastActionRoundsAgo++;
        
// Dispatch round begin
        new RoundBeginClientRequest({
            channelId: this.channelId,
            participants: this.participants.map(function(bc){
                return {
                    creature: bc.creature.toSocket(),
                    blocking: bc.blocking,
                    defeated: bc.defeated,
                    exhaustion: bc.exhaustion,
                    charges: bc.charges,
                    teamNumber: bc.teamNumber,
                };
            }),
        })
        .send(this.getClient());

// Sort participants to determine order of attacks
// Determine order by current (with effects) agility
        this.participants.sort(function(a,b){
            return b.creature.stats.agility - a.creature.stats.agility;
        });

// Run any onRoundBegin effects
        for(var i=0;i<this.participants.length;i++){
            const p = this.participants[i];

            if(!p.defeated){
                continue;
            }

            p.creature.tempEffects.forEach((roundsLeft,effect)=>{
                if(p.defeated){
                    return;
                }
                
                if(effect.onRoundBegin && !this.battleHasEnded){
                    effect.onRoundBegin({
                        target: p.creature,
                        sendBattleEmbed: this.sendEffectApplied
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

// Run one queued attack per participant if they have any
        for(var i = 0;i<this.participants.length;i++){
            const p = this.participants[i];

            if(p.defeated){
                continue;
            }

// For AI participants if they don't have a queued attack send a random attack
            if(p.queuedAttackSteps.length == 0 && p.creature instanceof CreatureAIControlled){
                const pai = p.creature as CreatureAIControlled;

                const randomAttack = pai.getRandomAttack();

                const opponents = [];

                //so long as the battle is going on this should find something
                this.participants.forEach(function(opponent){
                    if(!opponent.defeated && opponent.teamNumber != p.teamNumber){
                        opponents.push(opponent);
                    }
                });

                const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

                this._creatureAttack(p,randomAttack,randomOpponent);
            }
            else if(p.queuedAttackSteps.length > 0){
                this._sendNextAttackStep(p);

                if(this.battleHasEnded){
                    return;
                }
            }
        }

// Queue next tick
        setTimeout(this._roundTick.bind(this),ATTACK_TICK_MS);
    }

    participantDefeated(participant:IBattleCreature){
        participant.defeated = true;
        participant.creature.clearTemporaryEffects();

        let teamDefeated = true;

        this.participants.forEach(function(p){
            if(p.teamNumber == participant.teamNumber && p.defeated == false){
                teamDefeated = false;
            }
        });

        if(teamDefeated){
            const result = participant.teamNumber == 1 ? BattleResult.Team2Won : BattleResult.Team1Won;

            this.endBattle(result);
        }
    }

    endBattle(result:BattleResult){
        this.battleHasEnded = true;

        this.participants.forEach(function(p){
            if(p instanceof PlayerCharacter){
                (p as PlayerCharacter).battle = null;
            }
        });

        this.battleCleanup({
            result: result,
            wishesEarned: null,
        });
    }

    _getBattleCreatureForAction(creature:Creature):IBattleCreature{
        const bc = this.participantsLookup.get(creature);

        if(!bc){
            throw 'You are not in this battle';
        }

        if(bc.exhaustion>0){
            throw 'You are too exhausted';
        }
        
        if(bc.defeated){
            throw 'You have already been defeated';
        }

        return bc;
    }

    playerActionBlock(attacker:Creature){
        const bc = this._getBattleCreatureForAction(attacker);

        if(bc.blocking){
            throw 'You are already blocking';
        }

        bc.exhaustion++;
        bc.blocking = true;

        new BlockedClientRequest({
            channelId: this.channelId,
            blockerTitle: bc.creature.title
        })
        .send(this.getClient());

        this.lastActionRoundsAgo = 0;
    }
    
    playerActionCharge(creature:Creature){
        const bc = this._getBattleCreatureForAction(creature);

        bc.exhaustion++;
        bc.charges++;

        new ChargedClientRequest({
            channelId: this.channelId,
            chargerTitle: creature.title,
            total: bc.charges,
        })
        .send(this.getClient());

        this.lastActionRoundsAgo = 0;
    }

    //Primary job is to exhaust player
    useItem(creature:Creature,item:ItemUsable){
        const bc = this._getBattleCreatureForAction(creature);
        
        bc.exhaustion += item.battleExhaustion;

        this.lastActionRoundsAgo = 0;
    }
    
    playerActionAttack(attacker:Creature,attack:WeaponAttack,defender?:Creature){
        const bca = this._getBattleCreatureForAction(attacker);
        
        let bcb;

        if(defender){
            bcb = this.participantsLookup.get(defender);

            if(!bcb){
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

            bcb = survivingFriends[Math.floor(survivingFriends.length * Math.random())];
        }
        else{// if(!attack.isFriendly){
            const survivingEnemies = [];

            this.participants.forEach(function(bc){
                if(!bc.defeated && bc.teamNumber != bca.teamNumber){
                    survivingEnemies.push(bc);
                }
            });

            bcb = survivingEnemies[Math.floor(survivingEnemies.length * Math.random())];
        }   

        this._creatureAttack(bca,attack,bcb);
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
        const queuedAttackStep = attacker.queuedAttackSteps.shift();
        const defender = queuedAttackStep.target;

        const damages:IDamageSet = queuedAttackStep.step.getDamages({
            attacker: attacker,
            defender: defender,
            battle: this,
            step: queuedAttackStep.step,
        });

        let attackCancelled = false;

        attacker.creature.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttack && !effect.onAttack({
                target: attacker.creature,
                sendBattleEmbed: this.sendEffectApplied
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
                sendBattleEmbed: this.sendEffectApplied
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
            attacked: [{
                creature: defender.creature.toSocket(),
                damages: damages,
                blocked: false,
                exhaustion: 0,
            }],
            message: queuedAttackStep.step.attackMessage
                .replace('{defender}',defender.creature.title)
                .replace('{attacker}',attacker.creature.title),
        })
        .send(this.getClient());
    }

    addTemporaryEffect(target:Creature,effect:BattleTemporaryEffect,rounds:number){
        target.addTemporaryEffect(effect,rounds);

        if(effect.onAdded){
            effect.onAdded({
                target: target,
                sendBattleEmbed: this.sendEffectApplied
            });
        }
    }

    removeTemporaryEffect(target:Creature,effect:BattleTemporaryEffect){
        if(effect.onRemoved){
            effect.onRemoved({
                target:target,
                sendBattleEmbed:this.sendEffectApplied
            });
        }

        target.removeTemporaryEffect(effect);
    }

    sendEffectApplied(msg:string,color:number){
        const request = new EffectMessageClientRequest({
            channelId: this.channelId,
            msg: msg,
            color: color,
        });

        request.send(this.getClient());
    }
}