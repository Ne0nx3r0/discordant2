import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const PointyMageHat = new ItemEquippable({
    id: ItemId.PointyMageHat,
    title: 'Pointy Mage Hat',
    description: `(+1 Physical Resistance, +1 Spirit) Before the great collapse these hats were typically worn by apprentices. Though ragged and sunbleached, it seems some of the enchantments put on it have survived.`,
    goldValue: 200,
    slotType:'hat',
    useRequirements:{
        strength: 8,
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 1;
        e.target.stats.spirit += 1;
    },
});