import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const WornLeatherHelmet = new ItemEquippable({
    id: ItemId.WornLeatherHelmet,
    title: 'Worn Leather Helmet',
    description: `(+1 physical resistance) A makeshift helmet of hardened animal hide wraps held together by metal studs`,
    goldValue: 15,
    slotType:'hat',
    useRequirements: {
        strength: 12
    },
    onAddBonuses:(e)=>{
        e.target.stats.resistances.physical += 1;
    }
});