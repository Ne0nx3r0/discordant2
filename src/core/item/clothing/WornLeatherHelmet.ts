import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const WornLeatherHelmet = new ItemEquippable({
    id: ItemId.WornLeatherHelmet,
    title: 'Worn Leather Helmet',
    description: `(+1 physical resistance) A makeshift helmet of hardened animal hide wraps held together by metal studs`,
    goldValue: 15,
    slotType:'hat',
    useRequirements: {
        strength: 12
    },
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 1;
    }
});