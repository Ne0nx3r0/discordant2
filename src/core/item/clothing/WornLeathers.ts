import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const WornLeathers = new ItemEquippable({
    id: ItemId.WornLeathers,
    title: 'Worn Leathers',
    description: `(15% Physical Resistance) A set of hardened animal hide braces that cover the chest, arms and legs`,
    goldValue: 30,
    slotType:'armor',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 0.15;
    }
});