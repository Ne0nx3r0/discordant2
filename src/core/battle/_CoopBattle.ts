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
import PlayerParty from '../party/PlayerParty';
import { IRemoveBattleFunc } from '../../gameserver/game/Game';
import GetEarnedWishes from "../../util/GetEarnedWishes";

const dummyAttack = new WeaponAttackStep({
    attackMessage: '{attacker} doesn\'t know what to do!',
    damageFunc: function(){return {};}
});

interface PlayerDamaged{
    bpc:IBattlePlayerCharacter,
    damages:IDamageSet,
    blocked:boolean,
}

interface CoopBattleBag{
    id:string;
    party: PlayerParty;
    partyMembers: Array<PlayerCharacter>;
    opponent:CreatureAIControlled;
    getClient:IGetRandomClientFunc;
    removeBattle:IRemoveBattleFunc;
}

export default class CoopBattle extends PlayerBattle {
    party: PlayerParty;
    opponent:CreatureAIControlled;
    _opponentCurrentAttack:WeaponAttack;
    _opponentCurrentAttackStep:number;

    constructor(bag:CoopBattleBag){
        super({
            channelId: bag.party.channelId,
            pcs: bag.partyMembers,
            getClient: bag.getClient,
            removeBattle: bag.removeBattle,
        });

        this.opponent = bag.opponent;
        this.party = bag.party;

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
                        target:bpc.pc,
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

        if(this.opponent.hpCurrent<1){
            this.endBattle(true,null);

            return;
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

        this._sendAttackStep(this.opponent,attackStep,playerToAttack.pc);

//check if anybody died
        this.bpcs.forEach((bpc:IBattlePlayerCharacter)=>{
            if(bpc.defeated) return;

            if(bpc.pc.hpCurrent < 1){
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

                this._sendAttackStep(bpc.pc,attackStep,this.opponent);

                if(this.opponent.hpCurrent<1){
                    this.endBattle(true,bpc);
                    return;
                }
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

    endBattle(victory:boolean,killer?:IBattlePlayerCharacter){
        this._battleEnded = true;

        const bpcs = [];

        let partyLevel = 0;
        
        this.bpcs.forEach(function(bpc){
            if(bpc.pc.level > partyLevel){
                partyLevel = bpc.pc.level;
            }
        });

        this.bpcs.forEach((bpc)=>{
            const wishesEarned = GetEarnedWishes({
                baseWishes: this.opponent.wishesDropped,
                partySize: this.bpcs.size,
                playerLevel: bpc.pc.level,
                highestLevel: partyLevel
            });
            
            bpcs.push({
                player: bpc.pc.toSocket(),
                wishesEarned: wishesEarned,
            });
        });

        new CoopBattleEndedClientRequest({
            channelId: this.channelId,
            players: bpcs,
            opponent: this.opponent.toSocket(),
            victory: victory,
            killer: killer ? killer.pc.toSocket() : null,
        })
        .send(this.getClient());

        //release players from the battle lock
        this.bpcs.forEach((bpc)=>{
            bpc.pc.battle = null;
            bpc.pc.status = 'inParty';
            bpc.pc.clearTemporaryEffects();
        });

        this.removeBattle(this.channelId);
        
        this.party.returnFromBattle(victory,bpcs);
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