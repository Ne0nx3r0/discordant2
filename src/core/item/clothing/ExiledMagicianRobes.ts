import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const ExiledMagicianRobes = new ItemEquippable({
    id: ItemId.ExiledMagicianRobes,
    title: 'Exiled Magician Robes',
    description: `A creature item`,
    goldValue: 1,
    slotType:'armor',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 20;
        stats.resistances.thunder += 20;
        stats.resistances.dark += 20;
        stats.resistances.fire += 20;
    }
});