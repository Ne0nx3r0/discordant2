import Creature from '../creature/Creature';
import EffectId from './EffectId';
import { ICreatureStatSet } from '../creature/Creature';
import { IWeaponAttackDamages } from '../item/WeaponAttackStep';
import CreatureBattleTurnBased from '../battle/CreatureBattleTurnBased';

interface BattleEmbedFunc{
    (msg:Array<string>):void;
}

export interface EffectEventBag{
    target:Creature;
    sendBattleEmbed:BattleEmbedFunc;
    battle:CreatureBattleTurnBased;
}

interface RoundEffectFunc{
    (bag:EffectEventBag):void;
}

interface RoundEffectAttackFunc{
    (bag:EffectEventBag,damages:IWeaponAttackDamages):boolean;
}

interface RoundEffectStatsFunc{
    (stats:ICreatureStatSet,roundsLeft:number):void;/* modify the stats object and let it fall back to the caller */
}

export type EffectEventHandler = 'onAdded' | 'onRoundBegin' | 'onAttack' | 'onAttacked' | 'onRemoved';

interface BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    onAddBonuses?:RoundEffectStatsFunc;
    onAdded?:RoundEffectFunc;
    onRoundBegin?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onAttacked?:RoundEffectAttackFunc;
    onRemoved?:RoundEffectFunc;
}

export default class BattleTemporaryEffect{
    id:EffectId;
    title:string;
    onAdded?:RoundEffectFunc;
    onAddBonuses?:RoundEffectStatsFunc;
    onRoundBegin?:RoundEffectFunc;
    //onAttack?:RoundEffectAttackFunc;
    //onAttacked?:RoundEffectAttackFunc;
    onRemoved?:RoundEffectFunc;

    constructor(bag:BattleTemporaryEffectBag){
        this.title = bag.title;
        this.onAdded = bag.onAdded;
        this.onAddBonuses = bag.onAddBonuses;
        this.onRoundBegin = bag.onRoundBegin;
        //this.onAttack = bag.onAttack;
        //this.onAttacked = bag.onAttacked;
        this.onRemoved = bag.onRemoved;
    }
}

/*
Poison
Recovery
Stun
Dodge*/