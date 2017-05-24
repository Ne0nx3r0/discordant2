import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const ClothTunic = new ItemEquippable({
    id: ItemId.ClothTunic,
    title: 'Cloth Tunic',
    description: `(+1 Physical Resistance) A very basic robe worn by the everyday man.`,
    goldValue: 15,
    slotType:'armor',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 1;
    }
});