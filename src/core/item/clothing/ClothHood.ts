import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const ClothHood = new ItemEquippable({
    id: ItemId.ClothHood,
    title: 'Cloth Hood',
    description: `(+1 all resistances) A hood made of dyed cloth which provides some measure of protection against the elements.`,
    goldValue: 10,
    slotType:'hat',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 1;
        stats.resistances.fire += 1;
        stats.resistances.thunder += 1;
        stats.resistances.dark += 1;
    }
});