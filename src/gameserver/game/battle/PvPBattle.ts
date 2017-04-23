import { IBattlePlayerCharacter, ATTACK_TICK_MS } from '../../../core/battle/PlayerBattle';
import PlayerBattle from '../../../core/battle/PlayerBattle';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import BattleTemporaryEffect from '../../../core/effects/BattleTemporaryEffect';
import IDamageSet, { damagesTotal } from '../../../core/damage/IDamageSet';
import { IGetRandomClientFunc } from '../../socket/SocketServer';
import RoundBeginClientRequest from '../../../client/requests/RoundBeginClientRequest';
import WeaponAttackStep from '../../../core/item/WeaponAttackStep';
import PvPBattleEndedClientRequest from '../../../client/requests/PvPBattleEndedClientRequest';
import DeleteChannelClientRequest from "../../../client/requests/DeleteChannelClientRequest";
import PvPBattleExpiredClientRequest from '../../../client/requests/PvPBattleExpiredClientRequest';
import AttackedClientRequest from '../../../client/requests/AttackedClientRequest';
import { IRemoveBattleFunc } from "../Game";

const INACTIVE_ROUNDS_BEFORE_CANCEL_BATTLE = 10;

interface PvPBattleBag{
    channelId:string;
    pc1:PlayerCharacter;
    pc2:PlayerCharacter;
    getClient:IGetRandomClientFunc;
    removeBattle:IRemoveBattleFunc;
}

export default class PvPBattle extends PlayerBattle{
    bpc1:IBattlePlayerCharacter;
    bpc2:IBattlePlayerCharacter;

    constructor(bag:PvPBattleBag){
        super({
            channelId: bag.channelId,
            pcs: [bag.pc1,bag.pc2],
            getClient: bag.getClient,
            removeBattle: bag.removeBattle,
        });

        this.bpc1 = this.bpcs.get(bag.pc1);
        this.bpc2 = this.bpcs.get(bag.pc2);

        setTimeout(this.tick.bind(this),ATTACK_TICK_MS);
    }

    tick(){
        if(this.lastActionRoundsAgo >= INACTIVE_ROUNDS_BEFORE_CANCEL_BATTLE){
            this.expireBattle();

            return;
        }
        
        this.lastActionRoundsAgo++;

        if(this._battleEnded){
            return;
        }

//sort attackers and send any queued attacks
        const orderedAttacks = [this.bpc1,this.bpc2].sort(whoGoesFirst);
        const bpc1 = orderedAttacks[0];
        const bpc2 = orderedAttacks[1];

//Dispatch round begin
        const ClientRequest = new RoundBeginClientRequest({
            channelId: this.channelId
        });

        ClientRequest.send(this.getClient());

//Run any temporary effects onRoundBegin
        orderedAttacks.forEach((bpc:IBattlePlayerCharacter)=>{
            bpc.pc.tempEffects.forEach((roundsLeft:number,effect:BattleTemporaryEffect)=>{
                if(!this._battleEnded && effect.onRoundBegin){
                    effect.onRoundBegin({
                        target: bpc.pc,
                        sendBattleEmbed: this.sendEffectApplied,
                    });

                    if(bpc.pc.hpCurrent<1){
                        this.endBattle(bpc==bpc1?bpc2:bpc1,bpc);
                    }
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
        
        if(this._battleEnded) return;

        if(bpc1.queuedAttacks.length>0){
            const attackStep = bpc1.queuedAttacks.shift();

            this._sendAttackStep(bpc1,attackStep);
        }
        
        if(this._battleEnded) return;

        if(bpc2.queuedAttacks.length>0){
            const attackStep = bpc2.queuedAttacks.shift();

            this._sendAttackStep(bpc2,attackStep);
        }
        
        if(this._battleEnded) return;

        this.bpcs.forEach(function(bpc){
            if(bpc.exhaustion>0){
                bpc.exhaustion--;
            }
            if(bpc.blocking){
                bpc.blocking = false;
            }
        });

//schedule next tick if appropriate
        if(!this._battleEnded){
            setTimeout(this.tick.bind(this),ATTACK_TICK_MS);
        }
    }

    _sendAttackStep(attacker:IBattlePlayerCharacter,step:WeaponAttackStep){
        let defender:IBattlePlayerCharacter;

        this.bpcs.forEach(function(bpc:IBattlePlayerCharacter){
            if(bpc.pc.uid != attacker.pc.uid){
                defender = bpc;
            }
        });

        const damages:IDamageSet = step.getDamages({
            attacker: attacker.pc,
            defender: defender.pc,
            battle: this,
            step: step,
        });

        if(defender.blocking){
            const afterBlockedPercent = 1 - defender.pc.equipment.weapon.damageBlocked - defender.pc.equipment.offhand.damageBlocked;

            Object.keys(damages).forEach(function(damageType){
                damages[damageType] = Math.round(damages[damageType] * afterBlockedPercent);
            });
        }
        else{
            Object.keys(damages).forEach(function(damageType){
                damages[damageType] = Math.round(damages[damageType]);
            });
        }

        let attackCancelled = false;

        attacker.pc.tempEffects.forEach((rounds:number,effect:BattleTemporaryEffect)=>{
            if(effect.onAttack && !effect.onAttack({
                target:attacker.pc,
                sendBattleEmbed:this.sendEffectApplied
            },damages)){
                attackCancelled = true;
            };
        });

        if(attacker.pc.hpCurrent<1){
            this.endBattle(defender,attacker);
        }

        if(attackCancelled){
            return;
        }

        defender.pc.tempEffects.forEach((rounds:number,effect:BattleTemporaryEffect)=>{
            if(effect.onAttacked && !effect.onAttacked({
                target:defender.pc,
                sendBattleEmbed:this.sendEffectApplied
            },damages)){
                attackCancelled = true;
            };
        });

        if(defender.pc.hpCurrent<1){
            this.endBattle(attacker,defender);
        }

        if(attackCancelled){
            return;
        }
        
        defender.pc.hpCurrent -= Math.round(damagesTotal(damages));

        const ClientRequest = new AttackedClientRequest({
            channelId: this.channelId,
            attacker: attacker.pc.toSocket(),
            message: step.attackMessage
                .replace('{attacker}',attacker.pc.title)
                .replace('{defender}',defender.pc.title),
            attacked: [{
                creature: defender.pc.toSocket(),
                damages: damages,
                blocked: defender.blocking,
                exhaustion: defender.exhaustion,
            }]
        });

        ClientRequest.send(this.getClient());

        if(defender.pc.hpCurrent<1){
            this.endBattle(attacker,defender);
        }
    }

    endBattle(winner:IBattlePlayerCharacter,loser:IBattlePlayerCharacter){
        const ClientRequest = new PvPBattleEndedClientRequest({
            winner: winner.pc.toSocket(),
            loser: loser.pc.toSocket(),
            channelId: this.channelId
        });

        ClientRequest.send(this.getClient());

        this.cleanupBattle();
    }

    expireBattle(){
        new PvPBattleExpiredClientRequest({
            channelId: this.channelId
        }).send(this.getClient());

        this.cleanupBattle();
    }

    cleanupBattle(){
        this._battleEnded = true;

        this.bpcs.forEach(function(bpc){
            bpc.pc.battle = null;
            bpc.pc.status = 'inCity';
            bpc.pc.clearTemporaryEffects();
            bpc.pc.hpCurrent = bpc.pc.stats.hpTotal;
        });

        this.removeBattle(this.channelId);

        setTimeout(()=>{
            const ClientRequest = new DeleteChannelClientRequest({
                channelId: this.channelId
            });

            ClientRequest.send(this.getClient());
        },60000);
    }
}

//Lowest exhaustion or random agility-based goes first
function whoGoesFirst(a:IBattlePlayerCharacter,b:IBattlePlayerCharacter){
    if(a.exhaustion == b.exhaustion){
        return b.pc.stats.agility * Math.random() - a.pc.stats.agility * Math.random();
    }

    return a.exhaustion - b.exhaustion;
}