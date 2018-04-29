import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';
import { EquipmentSlot } from '../CreatureEquipment';
import { ICreatureStatSet } from '../../creature/Creature';

export const RedEyeAmulet = new ItemEquippable({
    id: ItemId.RedEyeAmulet,
    title: 'Red Eye Amulet',
    description: `(increase chance of getting attacked while in a battle) A remarkable gem, the red-eyed sapphire is a blue crystal containing a glowing red center. The beasts and demons that took to wandering the plains after the great collapse are oddly attracted to them, as though the gems contain some form of salvation.`,
    goldValue: 300,
    slotType: 'amulet',
    onAddBonuses:function(stats:ICreatureStatSet){
        stats.redEye += 3;
    }
});