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
        const eventData:IBattleRoundBeginEvent = {
            battle:this
        };

        this.dispatch(BattleEvent.RoundBegin,eventData);

        this.bpcs.forEach((bpc)=>{
            bpc.pc._tempEffects.forEach((roundsLeft,effect)=>{
                if(effect.onRoundBegin){
                    effect.onRoundBegin({
                        target:this.opponent,
                        sendBattleEmbed:this.sendEffectApplied
                    });
                }

                if(roundsLeft==1){
                    bpc.pc._removeTemporaryEffect(effect);

                    if(effect.onRemoved){
                        effect.onRemoved({
                            target: bpc.pc,
                            sendBattleEmbed: this.sendEffectApplied,
                        });
                    }
                }
                else{
                    bpc.pc._tempEffects.set(effect,roundsLeft-1);
                }
            });
        });

        this.opponent._tempEffects.forEach((roundsLeft,effect)=>{
            if(effect.onRoundBegin){
                effect.onRoundBegin({
                    target:this.opponent,
                    sendBattleEmbed:this.sendEffectApplied
                });
            }

            if(roundsLeft==1){
                this.opponent._removeTemporaryEffect(effect);

                if(effect.onRemoved){
                    effect.onRemoved({
                        target: this.opponent,
                        sendBattleEmbed: this.sendEffectApplied,
                    });
                }
            }
            else{
                this.opponent._tempEffects.set(effect,roundsLeft-1);
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

        const eventData:IBattleAttackEvent = {
            attacker: this.opponent,
            battle:this,
            attacked: [] as Array<IAttacked>,
            message:attackStep.attackMessage
                .replace('{attacker}',this.opponent.title)
                .replace('{defender}',playerToAttack.pc.title)
        };

        //damages calculates resistances
        const pcDamages:IDamageSet = attackStep.getDamages({
            attacker: this.opponent,
            defender: playerToAttack.pc,
            battle: this,
        });

        let attackCancelled = false;

        this.opponent._tempEffects.forEach((roundsLeft,effect)=>{
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

        playerToAttack.pc._tempEffects.forEach((roundsLeft,effect)=>{
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
                pcDamages[type] = Math.round(pcDamages[type] * (1-playerToAttack.pc.damageBlocked));
            });

            const eventData:IBattleBlockEvent = {
                battle:this,
                blocker:playerToAttack
            };
        }

        playerToAttack.pc.HPCurrent -= Math.round(damagesTotal(pcDamages));

        eventData.attacked.push({
            creature:playerToAttack.pc,
            damages:pcDamages,
            blocked:playerToAttack.blocking,
            exhaustion:playerToAttack.exhaustion,
        });

        this.dispatch(BattleEvent.Attack,eventData);

//check if anybody died
        this.bpcs.forEach((bpc:IBattlePlayerCharacter)=>{
            if(bpc.defeated) return;

            if(bpc.pc.HPCurrent < 1){
                const eventData:IBattlePlayerDefeatedEvent = {
                    battle: this,
                    player: bpc,
                };

                bpc.defeated = true;
                
                this.dispatch(BattleEvent.PlayerDefeated,eventData);
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
            battle: this,
        });

        bpc.exhaustion += step.exhaustion;

        let attackCancelled = false;

        bpc.pc._tempEffects.forEach((roundsLeft,effect)=>{
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

        this.opponent._tempEffects.forEach((roundsLeft,effect)=>{
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

        const eventData:IBattleAttackEvent = {
            attacker: bpc.pc,
            battle: this,
            message:step.attackMessage
                .replace('{defender}',this.opponent.title)
                .replace('{attacker}',bpc.pc.title),
            attacked: [{
                creature: this.opponent,
                damages: damages,
                blocked: false,
                exhaustion: 0,
            }],
        };

        this.dispatch(BattleEvent.Attack,eventData);

        if(this.opponent.HPCurrent<1){
            this.endBattle(true,bpc);
        }
    }

    endBattle(victory:boolean,killer?:IBattlePlayerCharacter){
        this._battleEnded = true;
/*
        let xpEarned = 0;

        //Note: Game is responsible for listening for and adjusting player stats based on this event
        if(victory){
            xpEarned = this.opponent.xpDropped;
        }*/

        const bpcs = [];

        this.bpcs.forEach(function(bpc){
            bpcs.push({
                bpc: bpc,
                //xpEarned: xpEarned,
            });
        });

        const eventData:ICoopBattleEndEvent = {
            battle:this,
            players: bpcs,
            opponent: this.opponent,
            victory: victory,
            killer: killer,
        };

        this.dispatch(BattleEvent.CoopBattleEnd,eventData);

        //release players from the battle lock
        this.bpcs.forEach((bpc)=>{
            bpc.pc.battle = null;
            bpc.pc.status = 'inParty';
            bpc.pc._clearTemporaryEffects();
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