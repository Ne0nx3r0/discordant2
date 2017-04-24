import Creature from "../creature/Creature";
import { IGetRandomClientFunc } from "../../gameserver/socket/SocketServer";
import { IRemoveBattleFunc } from "../../gameserver/game/Game";
import PlayerCharacter from "../creature/player/PlayerCharacter";
import ItemUsable from "../item/ItemUsable";
import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from "../item/WeaponAttackStep";
import BlockedClientRequest from "../../client/requests/BlockedClientRequest";
import ChargedClientRequest from "../../client/requests/ChargedClientRequest";
import IDamageSet from '../damage/IDamageSet';

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
    team: number;
    queuedAttackSteps:Array<BattleCreatureAttackStep>;
}

interface CreatureBattleBag {
    channelId:string;
    team1:Array<Creature>;
    team2:Array<Creature>;
    getClient:IGetRandomClientFunc;
    removeBattle:IRemoveBattleFunc;
}

export default class CreatureBattle{
    channelId:string;
    team1:Array<Creature>;
    team2:Array<Creature>;
    getClient:IGetRandomClientFunc;
    lastActionRoundsAgo:number;
    removeBattle:IRemoveBattleFunc;
    participants:Map<Creature,IBattleCreature>;

    constructor(bag:CreatureBattleBag){
        this.lastActionRoundsAgo = 0;
        this.channelId = bag.channelId;

        this.team1 = bag.team1;
        this.team2 = bag.team2;
        this.getClient = bag.getClient;
        this.removeBattle = bag.removeBattle;

        this.participants = new Map();

        this.team1.forEach((creature)=>{
            this.participants.set(creature,{
                creature:creature,
                blocking:false,
                defeated:false,
                exhaustion:1,//can't attack until first round
                charges:0,
                team:1,
                queuedAttackSteps:[],
            });
        });

        this.team2.forEach((creature)=>{
            this.participants.set(creature,{
                creature:creature,
                blocking:false,
                defeated:false,
                exhaustion:1,//can't attack until first round
                charges:0,
                team:2,
                queuedAttackSteps:[],
            });
        });
    }

    _getBattleCreatureForAction(creature:Creature):IBattleCreature{
        const bc = this.participants.get(creature);

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
            bcb = this.participants.get(defender);

            if(!bcb){
                throw 'Invalid target '+defender.title;
            }
        }
        else if(attack.isFriendly){
            const survivingFriends = [];

            this.participants.forEach(function(bc){
                if(!bc.defeated && bc.team == bca.team){
                    survivingFriends.push(bc);
                }
            });

            bcb = survivingFriends[Math.floor(survivingFriends.length * Math.random())];
        }
        else{// if(!attack.isFriendly){
            const survivingEnemies = [];

            this.participants.forEach(function(bc){
                if(!bc.defeated && bc.team != bca.team){
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
        const damages:IDamageSet = step.getDamages({
            attacker: attacker.pc,
            defender: defender.pc,
            battle: this,
            step: step,
        });

        we are here
    }
}