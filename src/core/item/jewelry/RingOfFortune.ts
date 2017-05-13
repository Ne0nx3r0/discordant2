import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const RingOfFortune = new ItemEquippable({
    id: ItemId.RingOfFortune,
    title: 'Ring of Fortune',
    description: `(+Magic Find) In search of a way to wish for more wishes, Southern philosophers instead discovered a technique which imbues a thing with the very essence of fortune, granting the wearer a sixth sense about where to look for treasures.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.magicFind += 1;
    }
});