import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const GhostSkin = new ItemEquippable({
    id: ItemId.GhostSkin,
    title: 'Ghost Skin',
    description: `A creature item`,
    goldValue: 1,
    showInItems: false,
    slotType: 'armor',
    onAddBonuses: function(stats:ICreatureStatSet){
        stats.resistances.physical += 100;
        stats.resistances.dark += 40;
        stats.resistances.fire -= 10;
    }
});