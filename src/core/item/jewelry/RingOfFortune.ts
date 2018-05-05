import ItemEquippable, { AddBonusesEvent } from '../ItemEquippable';
import ItemId from '../ItemId';


export const RingOfFortune = new ItemEquippable({
    id: ItemId.RingOfFortune,
    title: 'Ring of Fortune',
    description: `(+10 Magic Find) In search of a way to wish for more wishes, Southern philosophers instead discovered a technique which imbues a thing with the very essence of fortune, granting the wearer a sixth sense about where to look for treasures.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:(e)=>{
        e.target.stats.magicFind += 10;
    }
});