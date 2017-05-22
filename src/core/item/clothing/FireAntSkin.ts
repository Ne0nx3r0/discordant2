import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const FireAntSkin = new ItemEquippable({
    id: ItemId.FireAntSkin,
    title: 'Fire Ant Skin',
    description: `A creature item`,
    goldValue: 30,
    showInItems: false,
    slotType:'armor',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 2;
        stats.resistances.fire += 10;
    }
});