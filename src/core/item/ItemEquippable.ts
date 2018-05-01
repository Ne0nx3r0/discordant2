import ItemBase from './ItemBase';
import {ItemBaseBag} from './ItemBase';
import Creature from '../creature/Creature';
import {ICreatureStatSet} from '../creature/Creature';
import { EquipmentSlot } from './CreatureEquipment';

export interface ItemEquippableBag extends ItemBaseBag{
    slotType:EquipmentSlot;
    onAddBonuses?:OnAddBonusesHandler;
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
    (stats:ICreatureStatSet):void;//Modifies the statset if bonuses/penalties apply
}

//Modifies the damageset if bonuses/penalties apply
/*onAttack(currentDamages:DamageSet,wearer:Creature,wearerWeapon:Weapon,defender:Creature):DamageSet{
    return;
}not implemented yet
*/

//Modifies the damageset if bonuses/penalties apply
/*onDefend(currentDamages:DamageSet,wearer:Creature,attacker:Creature):DamageSet{
    return;
}not implemented yet
*/

export default class ItemEquippable extends ItemBase{
    slotType:EquipmentSlot;
    onAddBonuses?:OnAddBonusesHandler;
    useRequirements:UseRequirements;
    lostOnDeath:boolean;

    constructor(bag:ItemEquippableBag){
        super(bag);

        this.slotType = bag.slotType;

        if(bag.onAddBonuses) this.onAddBonuses = bag.onAddBonuses;

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