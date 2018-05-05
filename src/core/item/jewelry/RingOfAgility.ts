import ItemEquippable, { AddBonusesEvent } from '../ItemEquippable';
import ItemId from '../ItemId';


export const RingOfAgility = new ItemEquippable({
    id: ItemId.RingOfAgility,
    title: 'Ring of Agility',
    description: `(+1 Agility) As wishes made lower class work more obsolete, many took to entertainment arts like dancing and circus feats, procuring these rings to assist in their performances.\n\nThis particular example is quite inferior.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:(e)=>{
        e.target.stats.agility += 1;
    }
});