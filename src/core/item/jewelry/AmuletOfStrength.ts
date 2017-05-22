import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const AmuletOfStrength = new ItemEquippable({
    id: ItemId.AmuletOfStrength,
    title: 'Amulet of Strength',
    description: `(+1 Strength) Often created in bulk for warehouse workers and the like, this simple but functional jewelry was popular among the lower classes before the great collapse.\n\nThis particular example is quite inferior.`,
    goldValue: 100,
    slotType:'amulet',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.strength += 1;
    }
});