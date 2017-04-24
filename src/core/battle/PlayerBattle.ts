import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import Creature from '../creature/Creature';
import IDamageSet, { damagesTotal } from '../damage/IDamageSet';
import CreatureAIControlled from '../creature/CreatureAIControlled';

import ItemUsable from '../item/ItemUsable';
import BattleTemporaryEffect from '../effects/BattleTemporaryEffect';
import { IGetRandomClientFunc } from '../../gameserver/socket/SocketServer';
import BlockedClientRequest from '../../client/requests/BlockedClientRequest';
import EffectMessageClientRequest from '../../client/requests/EffectMessageClientRequest';
import { IRemoveBattleFunc } from '../../gameserver/game/Game';
import AttackedClientRequest from "../../client/requests/AttackedClientRequest";
import ChargedClientRequest from "../../client/requests/ChargedClientRequest";

export const ATTACK_TICK_MS = 10000;

interface PlayerBattleBag{
    channelId:string;
    pcs:Array<PlayerCharacter>;
    getClient:IGetRandomClientFunc;
    removeBattle:IRemoveBattleFunc;
}

export default class PlayerBattle {
    removeBattle: IRemoveBattleFunc;
    bpcs:Map<Creature,IBattlePlayerCharacter>;
    _battleEnded:boolean;
    getClient:IGetRandomClientFunc;
    channelId:string;
    lastActionRoundsAgo:number;

    constructor(bag: PlayerBattleBag){
        this._battleEnded = false;
        this.channelId = bag.channelId;
        this.lastActionRoundsAgo = 0;
        this.getClient = bag.getClient;
        this.removeBattle = bag.removeBattle;

        this.bpcs = new Map();
        
        bag.pcs.forEach((pc)=>{
            this.bpcs.set(pc,{
                pc:pc,
                battle: this,
                blocking: false,
                charges: 0,
                defeated: false,
                exhaustion: 1,//pc can't attack the mob until the mob attacks the pc
                queuedAttacks: [],
            });

            pc.battle = this;
            pc.status = 'inBattle';
        });

        this.sendEffectApplied = this.sendEffectApplied.bind(this);
    }
    
    playerActionAttack(pc:PlayerCharacter,attack:WeaponAttack,target?:PlayerCharacter){
        const bpc = this.bpcs.get(pc);
        
        if(!bpc){
            throw 'You are not in this battle';
        }
        
        if(bpc.defeated){
            throw 'You have already been defeated';
        }

        if(bpc.blocking){
            throw 'You are currently blocking';
        }

        if(bpc.exhaustion > 0){
            throw 'You are too exhausted to attack!';
        }

        if(bpc.charges < attack.chargesRequired){
            throw 'You do not have enough charges stored!';
        }

        if(target && !this.bpcs.has(target)){
            throw 'Invalid target';
        }

        bpc.exhaustion += attack.exhaustion;

        this._sendAttackStep(bpc.pc,attack.steps[0],target);

        bpc.charges -= attack.chargesRequired;

        this.lastActionRoundsAgo = 0;

        if(!this._battleEnded && attack.steps.length>1){
            bpc.queuedAttacks = attack.steps.slice(1);
        }
    }

    _sendAttackStep(attacker:Creature,step:WeaponAttackStep,defender:Creature){
        const damages:IDamageSet = step.getDamages({
            attacker: attacker,
            defender: defender,
            battle: this,
            step: step,
        });

        let attackCancelled = false;

        attacker.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttack && !effect.onAttack({
                target: attacker,
                sendBattleEmbed: this.sendEffectApplied
            }, damages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }

        defender.tempEffects.forEach((roundsLeft,effect)=>{
            if (effect.onAttacked && !effect.onAttacked({
                target: defender,
                sendBattleEmbed: this.sendEffectApplied
            }, damages)) {
                attackCancelled = true;
            }
        });

        if(attackCancelled){
            return;
        }        

        defender.hpCurrent -= Math.round(damagesTotal(damages));

        new AttackedClientRequest({
            channelId: this.channelId,
            attacker: attacker.toSocket(),            
            attacked: [{
                creature: defender.toSocket(),
                damages: damages,
                blocked: false,
                exhaustion: 0,
            }],
            message: step.attackMessage
                .replace('{defender}',defender.title)
                .replace('{attacker}',attacker.title),
        })
        .send(this.getClient());
    }

    playerActionBlock(pc:PlayerCharacter){
        const bpc = this.bpcs.get(pc);

        if(!bpc){
            throw 'You are not in in this battle';
        }

        if(bpc.blocking){
            throw 'You are already blocking';
        }

        if(bpc.defeated){
            throw 'You have already been defeated';
        }

        if(bpc.exhaustion > 0){
            throw 'You are too exhausted to block';
        }

        bpc.exhaustion++;
        bpc.blocking = true;

        const request = new BlockedClientRequest({
            channelId: this.channelId,
            blockerTitle: bpc.pc.title
        });
        
        request.send(this.getClient());

        this.lastActionRoundsAgo = 0;
    }

    playerActionCharge(pc:PlayerCharacter){
        const bpc = this.bpcs.get(pc);

        if(!bpc){
            throw 'You are not in in this battle';
        }

        if(bpc.blocking){
            throw 'You are already blocking';
        }

        if(bpc.defeated){
            throw 'You have already been defeated';
        }

        if(bpc.exhaustion > 0){
            throw 'You are too exhausted to block';
        }

        bpc.exhaustion++;
        bpc.charges++;

        const request = new ChargedClientRequest({
            channelId: this.channelId,
            chargerTitle: bpc.pc.title,
            total: bpc.charges,
        });
        
        request.send(this.getClient());

        this.lastActionRoundsAgo = 0;
    }

    getPlayerExhaustion(pc:PlayerCharacter):number{
        let bpc = this.bpcs.get(pc);

        if(bpc){
            return bpc.exhaustion;
        }

        //Caller's problem, they shouldn't have sent an invalid player
        throw `${pc.title} is not in this battle!`;
    }

    useItem(pc:PlayerCharacter,item:ItemUsable){
        const bpc = this.bpcs.get(pc);

        if(!bpc){
            throw 'You are not in this battle';
        }

        if(bpc.exhaustion > 0){
            throw 'You are too exausted to use this item!';
        }
        
        bpc.exhaustion += item.battleExhaustion;

        this.lastActionRoundsAgo = 0;
    }

    sendEffectApplied(msg:string,color:number){
        const request = new EffectMessageClientRequest({
            channelId: this.channelId,
            msg: msg,
            color: color,
        });

        request.send(this.getClient());
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
}

export enum BattleEvent{
    RoundBegin,
    Attack,
    Block,
    PlayerDefeated,
    PvPBattleEnd,
    PvPBattleExpired,
    CoopBattleEnd,
    EffectApplied,
}

export interface IBattlePlayerCharacter{
    pc:PlayerCharacter;
    battle:PlayerBattle;
    blocking:boolean;
    defeated:boolean;
    exhaustion:number;
    charges:number;
    queuedAttacks:Array<WeaponAttackStep>;
}

export interface IAttacked{
    creature: Creature;
    damages: IDamageSet;
    blocked: boolean;
    exhaustion: number;
}

export interface IBattleEffectEvent{
    battle: PlayerBattle;
    message: string;
    color: number;
}

export interface IBattleRoundBeginEvent{
    battle: PlayerBattle;
}

export interface IBattleAttackEvent{
    attacker: Creature;
    battle: PlayerBattle;
    message: string;
    attacked: Array<IAttacked>;
}

export interface IBattleBlockEvent{
    battle:PlayerBattle;
    blocker:IBattlePlayerCharacter;
}

export interface IBattlePlayerDefeatedEvent{
    battle: PlayerBattle;
    player: IBattlePlayerCharacter;
}

export interface IPvPBattleEndEvent{
    battle:PlayerBattle;
    winner:IBattlePlayerCharacter;
    loser:IBattlePlayerCharacter;
}

export interface IPvPBattleExpiredEvent{
    battle:PlayerBattle;
}

export interface ICoopBattleEndEvent{
    battle:PlayerBattle;
    players: Array<IBattlePlayerCharacter>;
    opponent:CreatureAIControlled;
    victory:boolean;
    killer?:IBattlePlayerCharacter;
}