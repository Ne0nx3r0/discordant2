import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const WillOWispSkin = new ItemEquippable({
    id: ItemId.WillOWispSkin,
    title: 'Will-O-Wisp Skin',
    description: `A creature item`,
    goldValue: 1,
    slotType:'armor',
    onAddBonuses: function(stats:ICreatureStatSet){
        stats.resistances.dark -= 20;
        stats.resistances.thunder += 20;
        stats.dodge += 1000;
    },
});