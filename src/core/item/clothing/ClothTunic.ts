import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const ClothTunic = new ItemEquippable({
    id: ItemId.ClothTunic,
    title: 'Cloth Tunic',
    description: `(+1 Physical Resistance) A very basic robe worn by commoners and adventurers alike.`,
    goldValue: 1,
    slotType:'armor',
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 1;
    }
});