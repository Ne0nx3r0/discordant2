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
    (stats:ICreatureStatSet,roundsLeft:number):void;
}

interface BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    onAddBonuses?:RoundEffectStatsFunc;
    onAdded?:RoundEffectFunc;
    onRoundBegin?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onDefend?:RoundEffectAttackFunc;
    onRemoved?:RoundEffectFunc;
}

export default class BattleTemporaryEffect{
    id:EffectId;
    title:string;
    onAdded?:RoundEffectFunc;
    onAddBonuses?:RoundEffectStatsFunc;
    onRoundBegin?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onDefend?:RoundEffectAttackFunc;
    onRemoved?:RoundEffectFunc;

    constructor(bag:BattleTemporaryEffectBag){
        this.id = bag.id;
        this.title = bag.title;
        if(bag.onAdded) this.onAdded = bag.onAdded;
        if(bag.onAddBonuses) this.onAddBonuses = bag.onAddBonuses;
        if(bag.onRoundBegin) this.onRoundBegin = bag.onRoundBegin;
        if(bag.onAttack) this.onAttack = bag.onAttack;
        if(bag.onDefend) this.onDefend = bag.onDefend;
        if(bag.onRemoved) this.onRemoved = bag.onRemoved;
    }
}