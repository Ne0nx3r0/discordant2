import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const MageRobe = new ItemEquippable({
    id: ItemId.MageRobe,
    title: 'Mage Robe',
    description: `(+3 Physical Resistance, +2 Spirit) A robe made from an enchanted fabric.\n\nLooking for a compromise between plain cloth and heavy armor, these robes were crafted for field medics and scouts during the wars that followed the great collapse.`,
    goldValue: 150,
    slotType:'armor',
    useRequirements:{
        strength: 8,
    },
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 3;
        stats.spirit += 2;
    },
});