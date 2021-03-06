import Creature from '../creature/Creature';
import EffectId from './EffectId';
import { ICreatureStatSet } from '../creature/Creature';
import WeaponAttackStep, { IWeaponAttackDamages } from '../item/WeaponAttackStep';
import CreatureBattleTurnBased, { IBattleCreature } from '../battle/CreatureBattleTurnBased';
import WeaponAttack from '../item/WeaponAttack';

export interface EffectEvent{
    target:Creature;
    battle:CreatureBattleTurnBased;
    roundsLeft:number;
}

interface DefeatEffectEvent{
    battle:CreatureBattleTurnBased;
    attacker: Creature;
    defender: Creature;
    wad: IWeaponAttackDamages;
}

export interface AttackEffectEvent extends DefeatEffectEvent{
    step: WeaponAttackStep;
    preventAttack: ()=>void;
}

interface BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    dispellable?: boolean;
    onAdded?: (event:EffectEvent)=>void;
    onRoundBegin?: (event:EffectEvent)=>void;
    onRemoved?: (event:EffectEvent)=>void;
    onAddBonuses?: (stats:ICreatureStatSet,roundsLeft:number)=>void;
    onAttack?: (event:AttackEffectEvent)=>void;
    onDefend?: (event:AttackEffectEvent)=>void;
    onDefeat?: (event:DefeatEffectEvent)=>void;
}

export default class BattleTemporaryEffect implements BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    dispellable?: boolean;
    onAdded?: (event:EffectEvent)=>void;
    onRoundBegin?: (event:EffectEvent)=>void;
    onRemoved?: (event:EffectEvent)=>void;
    onAddBonuses?: (stats:ICreatureStatSet,roundsLeft:number)=>void;
    onAttack?: (event:AttackEffectEvent)=>void;
    onDefend?: (event:AttackEffectEvent)=>void;
    onDefeat?: (event:DefeatEffectEvent)=>void;

    constructor(bag:BattleTemporaryEffectBag){
        this.id = bag.id;
        this.title = bag.title;
        this.dispellable = bag.dispellable || true;
        if(bag.onAdded) this.onAdded = bag.onAdded;
        if(bag.onAddBonuses) this.onAddBonuses = bag.onAddBonuses;
        if(bag.onRoundBegin) this.onRoundBegin = bag.onRoundBegin;
        if(bag.onAttack) this.onAttack = bag.onAttack;
        if(bag.onDefend) this.onDefend = bag.onDefend;
        if(bag.onDefeat) this.onDefeat = bag.onDefeat;
        if(bag.onRemoved) this.onRemoved = bag.onRemoved;
    }
}