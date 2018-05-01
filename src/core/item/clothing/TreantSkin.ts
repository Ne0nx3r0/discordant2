import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const TreantSkin = new ItemEquippable({
    id: ItemId.TreantSkin,
    title: 'Treant Skin',
    description: `A creature item`,
    goldValue: 1,
    slotType:'armor',
    onAddBonuses: function(stats:ICreatureStatSet){
        stats.resistances.dark += 20;
        stats.resistances.thunder += 20;
        stats.resistances.physical += 20;
        stats.resistances.fire -= 20;
    },
});