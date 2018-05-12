import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const ClothHood = new ItemEquippable({
    id: ItemId.ClothHood,
    title: 'Cloth Hood',
    description: `(+1 physical resistance) A hood made of dyed cloth which provides some measure of protection against the elements.`,
    goldValue: 1,
    slotType:'hat',
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 1;
    }
});