import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const AmuletOfAgility = new ItemEquippable({
    id: ItemId.AmuletOfAgility,
    title: 'Amulet of Agility',
    description: `(+1 Agility) As wishes made lower class work more obsolete, many took to entertainment arts like dancing and circus feats, procuring things like these amulets to assist in their performances.\n\nThis particular example is quite inferior.`,
    goldValue: 100,
    slotType:'amulet',
    onAddBonuses:(e)=>{
        e.target.stats.agility += 1;
    }
});