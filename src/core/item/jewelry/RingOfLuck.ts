import ItemEquippable, { AddBonusesEvent } from '../ItemEquippable';
import ItemId from '../ItemId';

export const RingOfLuck = new ItemEquippable({
    id: ItemId.RingOfLuck,
    title: 'Ring of Luck',
    description: `(+1 Luck) Most say these baubles do nothing, or at best instill a sense of bravery in the wearer. Yet, few can deny the allure of a good luck charm.\n\nThis particular example is of quite inferior quality.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:(e)=>{
        e.target.stats.luck += 1;
    }
});