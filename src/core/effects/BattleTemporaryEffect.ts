import Creature from '../creature/Creature';
import EffectId from './EffectId';
import { ICreatureStatSet } from '../creature/Creature';
import { IWeaponAttackDamages } from '../item/WeaponAttackStep';
import CreatureBattleTurnBased, { IBattleCreature } from '../battle/CreatureBattleTurnBased';

export interface EffectEventBag{
    target:IBattleCreature;
    battle:CreatureBattleTurnBased;
    roundsLeft:number
}

interface EffectEventFunc{
    (bag:EffectEventBag): void;
}

interface EffectAddBonusesFunc{
    (stats:ICreatureStatSet): void;
}

interface AttackEffectEventBag extends EffectEventBag{
    attacker: IBattleCreature;
    defender: IBattleCreature;
    wad: IWeaponAttackDamages;
    preventAttack: ()=>void;
}

interface AttackEffectEventFunc{
    (bag:EffectEventBag):void;
}


interface BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    onAdded?:EffectEventFunc;
    onRoundBegin?:EffectEventFunc;
    onRemoved?:EffectEventFunc;
    onAddBonuses?:EffectAddBonusesFunc;
    onAttack?:AttackEffectEventFunc;
    onDefend?:AttackEffectEventFunc;
}

export default class BattleTemporaryEffect implements BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    onAdded?:EffectEventFunc;
    onRoundBegin?:EffectEventFunc;
    onRemoved?:EffectEventFunc;
    onAddBonuses?:EffectAddBonusesFunc;
    onAttack?:AttackEffectEventFunc;
    onDefend?:AttackEffectEventFunc;

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