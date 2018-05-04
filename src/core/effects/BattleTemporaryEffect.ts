import Creature from '../creature/Creature';
import EffectId from './EffectId';
import { ICreatureStatSet } from '../creature/Creature';
import { IWeaponAttackDamages } from '../item/WeaponAttackStep';
import CreatureBattleTurnBased, { IBattleCreature } from '../battle/CreatureBattleTurnBased';

export interface EffectEvent{
    target:IBattleCreature;
    battle:CreatureBattleTurnBased;
    roundsLeft:number
}

interface AttackEffectEvent extends EffectEvent{
    attacker: IBattleCreature;
    defender: IBattleCreature;
    wad: IWeaponAttackDamages;
    preventAttack: ()=>void;
}

interface BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    onAdded?: (event:EffectEvent)=>void;
    onRoundBegin?: (event:EffectEvent)=>void;
    onRemoved?: (event:EffectEvent)=>void;
    onAddBonuses?: (stats:ICreatureStatSet)=>void;
    onAttack?: (event:AttackEffectEvent)=>void;
    onDefend?: (event:AttackEffectEvent)=>void;
}

export default class BattleTemporaryEffect implements BattleTemporaryEffectBag{
    id:EffectId;
    title:string;
    onAdded?: (event:EffectEvent)=>void;
    onRoundBegin?: (event:EffectEvent)=>void;
    onRemoved?: (event:EffectEvent)=>void;
    onAddBonuses?: (stats:ICreatureStatSet)=>void;
    onAttack?: (event:AttackEffectEvent)=>void;
    onDefend?: (event:AttackEffectEvent)=>void;

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