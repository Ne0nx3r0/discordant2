import ItemBase from './ItemBase';
import {ItemBaseBag} from './ItemBase';
import Creature from '../creature/Creature';
import {ICreatureStatSet} from '../creature/Creature';
import { EquipmentSlot } from './CreatureEquipment';

export interface ItemEquippableBag extends ItemBaseBag{
    slotType:EquipmentSlot;
    onAddBonuses?:OnAddBonusesHandler;
}

interface OnAddBonusesHandler{
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

    constructor(bag:ItemEquippableBag){
        super(bag);

        this.slotType = bag.slotType;

        if(bag.onAddBonuses) this.onAddBonuses = bag.onAddBonuses;
    }
}