import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const StuddedLeather = new ItemEquippable({
    id: ItemId.StuddedLeather,
    title: 'Studded Leather',
    description: `(+6 Physical Resistance) Leather armor made from flexible leather reinforced with metal rivets. During the great collapse a number of technologies were lost, but this simple design remained a valuable skill even apprentice blacksmiths could produce in mass to supply the troops holding the gates.`,
    goldValue: 400,
    slotType:'armor',
    useRequirements:{
        strength: 26,
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 6;
    },
});