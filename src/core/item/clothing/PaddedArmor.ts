import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const PaddedArmor = new ItemEquippable({
    id: ItemId.PaddedArmor,
    title: 'Padded Armor',
    description: `(+2 Physical Resistance, +2 Agility) These quilted layers of cloth and batting were common among the bands of thieves that raided towns during the great collapse. Though not as strong as metal armor, they provided some  protection while allowing for free movement.`,
    goldValue: 200,
    slotType:'armor',
    useRequirements:{
        strength: 8,
    },
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.resistances.physical += 2;
        stats.agility += 2;
    },
});