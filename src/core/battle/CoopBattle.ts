import PlayerCharacter from '../creature/player/PlayerCharacter';
import CreatureAIControlled from '../creature/CreatureAIControlled';
import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import IDamageSet from '../damage/IDamageSet';
import {damagesTotal} from '../damage/IDamageSet';
import AttackStep from '../item/WeaponAttackStep';
import PlayerBattle from './PlayerBattle';
import { IBattlePlayerCharacter, ICoopBattleEndEvent, ATTACK_TICK_MS, BattleEvent, IBattleAttackEvent, IBattlePlayerDefeatedEvent, IBattleBlockEvent, IAttacked, IBattleRoundBeginEvent } from './PlayerBattle';
import { IGetRandomClientFunc } from '../../gameserver/socket/SocketServer';
import RoundBeginClientRequest from '../../client/requests/RoundBeginClientRequest';
import BattleAttackClientRequest from '../../gameserver/socket/requests/BattleAttackRequest';
import AttackedClientRequest from '../../client/requests/AttackedClientRequest';
import { ClientRequestAttackedData, IAttackedSocket } from '../../client/requests/AttackedClientRequest';
import PassedOutClientRequest from '../../client/requests/PassedOutClientRequest';
import CoopBattleEndedClientRequest from "../../client/requests/CoopBattleEndedClientRequest";

const dummyAttack = new WeaponAttackStep({
    attackMessage: '{attacker} doesn\'t know what to do!',
    exhaustion: 1,
});

interface PlayerDamaged{
    bpc:IBattlePlayerCharacter,
    damages:IDamageSet,
    blocked:boolean,
}

interface CoopBattleBag{
    id:number;
    channelId:string;
    pcs:Array<PlayerCharacter>;
    opponent:CreatureAIControlled;
    getClient:IGetRandomClientFunc;
}

export default class CoopBattle extends PlayerBattle{
    opponent:CreatureAIControlled;
    _opponentCurrentAttack:WeaponAttack;
    _opponentCurrentAttackStep:number;

    constructor(bag:CoopBattleBag){
        super({
            channelId: bag.channelId,
            pcs: bag.pcs,
            getClient: bag.getClient,
        });

        this.opponent = bag.opponent;

        this._tick = this._tick.bind(this);

        setTimeout(this._tick,ATTACK_TICK_MS/2);
    }

    _tick(){   
        if(this._battleEnded){
            return;
        }

//Dispatch round begin
        new RoundBeginClientRequest({
            channelId: this.channelId
        })
        .send(this.getClient());

        this.bpcs.forEach((bpc)=>{
            bpc.pc.tempEffects.forEach((roundsLeft,effect)=>{
                if(effect.onRoundBegin){
                    effect.onRoundBegin({
                        target:this.opponent,
                        sendBattleEmbed:this.sendEffectApplied
                    });
                }

                if(roundsLeft==1){
                    bpc.pc.removeTemporaryEffect(effect);

                    if(effect.onRemoved){
                        effect.onRemoved({
                            target: bpc.pc,
                            sendBattleEmbed: this.sendEffectApplied,
                        });
                    }
                }
                else{
                    bpc.pc.tempEffects.set(effect,roundsLeft-1);
                }
            });
        });

        this.opponent.tempEffects.forEach((roundsLeft,effect)=>{
            if(effect.onRoundBegin){
                effect.onRoundBegin({
                    target:this.opponent,
                    sendBattleEmbed:this.sendEffectApplied
                });
            }

            if(roundsLeft==1){
                this.opponent.removeTemporaryEffect(effect);

                if(effect.onRemoved){
                    effect.onRemoved({
                        target: this.opponent,
                        sendBattleEmbed: this.sendEffectApplied,
                    });
                }
            }
            else{
                this.opponent.tempEffects.set(effect,roundsLeft-1);
            }
        });

        if(!this._opponentCurrentAttack){
            this._opponentCurrentAttack = this.opponent.getRandomAttack();
            this._opponentCurrentAttackStep = 0;
        }

        let attackStep;

        if(this._opponentCurrentAttack){    
            attackStep = this._opponentCurrentAttack.steps[this._opponentCurrentAttackStep++];
    
            if(this._opponentCurrentAttackStep >= this._opponentCurrentAttack.steps.length){
                this._opponentCurrentAttack = null;
            }   
        }
        //Didn't find an elgible attack
        else{
            attackStep = dummyAttack;
        }

        this.attackPlayers(attackStep);

        setTimeout(this._tick,ATTACK_TICK_MS);
    }

    attackPlayers(attackStep:WeaponAttackStep){
        const survivingPlayers:Array<IBattlePlayerCharacter> = [];
        
        this.bpcs.forEach(function(bpc){
            if(!bpc.defeated){
                survivingPlayers.push(bpc);
            }
        });

        const playerToAttack = survivingPlayers[Math.floor(Math.random() * survivingPlayers.length)];

        const eventData:ClientRequestAttackedData = {
            channelId: this.channelId,
            attacker: this.opponent.toSocket(),
            attacked: [] as Array<IAttackedSocket>,
            message:attackStep.attackMessage
                .replace('{attacker}',this.opponent.title)
                .replace('{defender}',playerToAttack.pc.title)
        };

        //damages calculates resistances
        const pcDamages:IDamageSet = attackStep.getDamages({
            attacker: this.opponent,
            defender: playerToAttack.pc,
        });

        let attackCancelled = false;

        this.opponent.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttack && !effect.onAttack({
                target: this.opponent,
                sendBattleEmbed: this.sendEffectApplied
            }, pcDamages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }

        playerToAttack.pc.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttacked && !effect.onAttacked({
                target: playerToAttack.pc,
                sendBattleEmbed: this.sendEffectApplied
            }, pcDamages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }

        if(playerToAttack.blocking){
            Object.keys(pcDamages).forEach(function(type){
                pcDamages[type] = Math.round(pcDamages[type] * (1-playerToAttack.pc.damagePercentBlocked));
            });

            const eventData:IBattleBlockEvent = {
                battle:this,
                blocker:playerToAttack
            };
        }

        playerToAttack.pc.HPCurrent -= Math.round(damagesTotal(pcDamages));

        eventData.attacked.push({
            creature:playerToAttack.pc.toSocket(),
            damages:pcDamages,
            blocked:playerToAttack.blocking,
            exhaustion:playerToAttack.exhaustion,
        });

        new AttackedClientRequest(eventData).send(this.getClient());

//check if anybody died
        this.bpcs.forEach((bpc:IBattlePlayerCharacter)=>{
            if(bpc.defeated) return;

            if(bpc.pc.HPCurrent < 1){
                bpc.defeated = true;

                new PassedOutClientRequest({
                    channelId: this.channelId,
                    creatureTitle: bpc.pc.title,
                })
                .send(this.getClient());
            }
        });

//Check if all players were defeated while updating their statuses
        let allPlayersDefeated = true;

        this.bpcs.forEach((bpc:IBattlePlayerCharacter)=>{
            if(this._battleEnded || bpc.defeated) return;

            allPlayersDefeated = false;

            if(bpc.queuedAttacks.length>0){
                const attackStep = bpc.queuedAttacks.shift();

                this._sendAttackStep(bpc,attackStep);
            }

            if(bpc.exhaustion>0){
                bpc.exhaustion--;
            }

            bpc.blocking = false;
        });

        if(allPlayersDefeated){
            this.endBattle(false);
        }
    }

    _sendAttackStep(bpc:IBattlePlayerCharacter,step:AttackStep){
        const damages:IDamageSet = step.getDamages({
            attacker: bpc.pc,
            defender: this.opponent,
        });

        bpc.exhaustion += step.exhaustion;

        let attackCancelled = false;

        bpc.pc.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttack && !effect.onAttack({
                target: bpc.pc,
                sendBattleEmbed: this.sendEffectApplied
            }, damages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }

        this.opponent.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttacked && !effect.onAttacked({
                target: this.opponent,
                sendBattleEmbed: this.sendEffectApplied
            }, damages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }

        this.opponent.HPCurrent -= Math.round(damagesTotal(damages));

        new AttackedClientRequest({
            channelId: this.channelId,
            attacker: bpc.pc.toSocket(),            
            attacked: [{
                creature: this.opponent.toSocket(),
                damages: damages,
                blocked: false,
                exhaustion: 0,
            }],
            message: step.attackMessage
                .replace('{defender}',this.opponent.title)
                .replace('{attacker}',bpc.pc.title),
        })
        .send(this.getClient());

        if(this.opponent.HPCurrent<1){
            this.endBattle(true,bpc);
        }
    }

    endBattle(victory:boolean,killer?:IBattlePlayerCharacter){
        this._battleEnded = true;
/* TODO: give player the xp they earned
        let xpEarned = 0;
        if(victory){
            xpEarned = this.opponent.xpDropped;
        }*/

        const bpcs = [];

        this.bpcs.forEach(function(bpc){
            bpcs.push({
                player: bpc.pc.toSocket(),
                //xpEarned: xpEarned,
            });
        });

        new CoopBattleEndedClientRequest({
            channelId: this.channelId,
            players: bpcs,
            opponent: this.opponent.toSocket(),
            victory: victory,
            killer: killer ? null : killer.pc.toSocket(),
        })
        .send(this.getClient());

        //release players from the battle lock
        this.bpcs.forEach((bpc)=>{
            bpc.pc.battle = null;
            bpc.pc.status = 'inParty';
            bpc.pc.clearTemporaryEffects();
        });
    }

    getPlayerExhaustion(pc:PlayerCharacter):number{
        const bpc = this.bpcs.get(pc);

        //Caller's problem, they should have checked first
        if(!bpc){
            throw `${pc.title} is not in this battle!`;
        }

        return bpc.exhaustion;
    }
}