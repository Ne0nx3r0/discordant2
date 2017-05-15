import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const RingOfStrength = new ItemEquippable({
    id: ItemId.RingOfStrength,
    title: 'Ring of Strength',
    description: `(+1 Strength) Often created in bulk for warehouse workers and the like, these simple but functional rings were popular among the lower classes before the great collapse.\n\nThis particular example is quite inferior.`,
    goldValue: 100,
    slotType:'ring',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.strength += 1;
    }
});