import ItemBase from './ItemBase';
import {ItemBaseBag} from './ItemBase';
import Creature from '../creature/Creature';
import {ICreatureStatSet} from '../creature/Creature';
import { EquipmentSlot } from './CreatureEquipment';
import CreatureBattleTurnBased, { IBattleCreature } from '../battle/CreatureBattleTurnBased';
import { IWeaponAttackDamages } from './WeaponAttackStep';

export interface ItemEquippableBag extends ItemBaseBag{
    slotType:EquipmentSlot;
    onAddBonuses?:OnAddBonusesHandler;
    onDefeat?:OnDefeatHandler;
    onDefend?:OnDefendHandler;
    useRequirements?:UseRequirements;
    lostOnDeath?:boolean;
}

export interface UseRequirements{
    strength?:number;
    agility?:number;
    vitality?:number;
    spirit?:number;
    luck?:number;
}

export interface OnAddBonusesHandler{
    (stats:ICreatureStatSet);//Modifies the statset if bonuses/penalties apply
}

interface BattleBag{
    battle:CreatureBattleTurnBased;
}

export interface OnBattlEventHandlerBag extends BattleBag{
    attacker: IBattleCreature;
    wad: IWeaponAttackDamages;
}

export interface OnDefendHandler{
    (bag: OnBattlEventHandlerBag): boolean;
}

export interface OnDefeatHandler{
    (bag: OnBattlEventHandlerBag):void;
}

export default class ItemEquippable extends ItemBase{
    slotType:EquipmentSlot;
    onAddBonuses?:OnAddBonusesHandler;
    onDefeat?:OnDefeatHandler;
    onDefend?:OnDefendHandler;
    useRequirements:UseRequirements;
    lostOnDeath:boolean;

    constructor(bag:ItemEquippableBag){
        super(bag);

        this.slotType = bag.slotType;

        if(bag.onAddBonuses) this.onAddBonuses = bag.onAddBonuses;
        if(bag.onDefeat) this.onDefeat = bag.onDefeat;
        if(bag.onDefend) this.onDefend = bag.onDefend;

        this.useRequirements = bag.useRequirements || {};
        this.lostOnDeath = bag.lostOnDeath;
    }

    canEquip(creature:Creature){
        for(var useRequirement in this.useRequirements){
            const requirementAmount = this.useRequirements[useRequirement];

            if(creature.stats[useRequirement] < requirementAmount){
                return false;
            }
        }

        return true;
    }
}