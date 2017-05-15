import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const RingOfHealth = new ItemEquippable({
    id: ItemId.RingOfHealth,
    title: 'Ring of Health',
    description: `(+1 Vitality) Wealthy elites will pay anything to prolong their lives as they come to an end, and so it's no surprise that in the wake of the birth of wishes a variety of jewelry was comissioned to accomplish this task.\n\nThis particular example is quite inferior and was likely discarded or sold to a buyer ignorant of its poor quality.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.vitality += 1;
    }
});