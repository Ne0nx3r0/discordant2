import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const MageRobe = new ItemEquippable({
    id: ItemId.MageRobe,
    title: 'Mage Robe',
    description: `(+3 Physical Resistance, +2 Spirit) A robe made from an enchanted fabric.\n\nLooking for a compromise between plain cloth and heavy armor, these robes were crafted for field medics and scouts during the wars that followed the great collapse.`,
    goldValue: 150,
    slotType:'armor',
    useRequirements:{
        strength: 8,
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 3;
        e.target.stats.spirit += 2;
    },
});