import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const ClothTunic = new ItemEquippable({
    id: ItemId.ClothTunic,
    title: 'Cloth Tunic',
    description: `(+1 All resistances) A very basic robe worn by commoners and adventurers alike.`,
    goldValue: 1,
    slotType:'armor',
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 1;
        e.target.stats.resistances.fire += 1;
        e.target.stats.resistances.thunder += 1;
        e.target.stats.resistances.dark += 1;
    }
});