import ItemEquippable, { AddBonusesEvent } from '../ItemEquippable';
import ItemId from '../ItemId';


export const RingOfSpirit = new ItemEquippable({
    id: ItemId.RingOfSpirit,
    title: 'Ring of Spirit',
    description: `(+1 Spirit) After the birth of wishes and magic, many sought quick means to learn the control of it others found so easily. This sort of jewelry was the result of their efforts.\n\nThis particular example is quite inferior.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:(e)=>{
        e.target.stats.spirit += 1;
    }
});