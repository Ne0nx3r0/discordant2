import Creature from '../creature/Creature';
import IDamageSet from '../damage/IDamageSet';
import BattleEffectId from './BattleEffectId';
import { ICreatureStatSet } from '../creature/Creature';

interface BattleEmbedFunc{
    (msg:string,color:number):void;
}

export interface EffectEventBag{
    target:Creature
    sendBattleEmbed:BattleEmbedFunc;
}

interface RoundEffectFunc{
    (bag:EffectEventBag):void;
}

interface RoundEffectAttackFunc{
    (bag:EffectEventBag,damages:IDamageSet):boolean;
}

interface RoundEffectStatsFunc{
    (stats:ICreatureStatSet):void;/* modify the stats object and let it fall back to the caller */
}

export type EffectEventHandler = 'onAdded' | 'onRoundBegin' | 'onAttack' | 'onAttacked' | 'onRoundEnd' | 'onRemoved';

interface BattleTemporaryEffectBag{
    id:BattleEffectId;
    title:string;
    onAddBonuses?:RoundEffectStatsFunc;
    onAdded?:RoundEffectFunc;
    onRoundBegin?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onAttacked?:RoundEffectAttackFunc;
    onRemoved?:RoundEffectFunc;
}

export default class BattleTemporaryEffect{
    id:BattleEffectId;
    title:string;
    onAdded?:RoundEffectFunc;
    onAddBonuses?:RoundEffectStatsFunc;
    onRoundBegin?:RoundEffectFunc;
    onAttack?:RoundEffectAttackFunc;
    onAttacked?:RoundEffectAttackFunc;
    onRemoved?:RoundEffectFunc;

    constructor(bag:BattleTemporaryEffectBag){
        this.title = bag.title;
        this.onAdded = bag.onAdded;
        this.onAddBonuses = bag.onAddBonuses;
        this.onRoundBegin = bag.onRoundBegin;
        this.onAttack = bag.onAttack;
        this.onAttacked = bag.onAttacked;
        this.onRemoved = bag.onRemoved;
    }
}

/*
Poison
Recovery
Stun
Dodge*/