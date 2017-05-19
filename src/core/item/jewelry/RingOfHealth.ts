import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const RingOfHealth = new ItemEquippable({
    id: ItemId.RingOfHealth,
    title: 'Ring of Health',
    description: `(+2 Vitality) Wealthy elites will pay anything to prolong their lives as they come to an end. So it was no surprise after the birth of wishes that a variety of jewelry was comissioned to improve the health of the wearer.\n\nThis particular example is quite inferior and was likely discarded or sold to a buyer ignorant of its poor quality.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.vitality += 2;
    }
});