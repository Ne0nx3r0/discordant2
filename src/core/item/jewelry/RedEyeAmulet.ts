import ItemEquippable, { AddBonusesEvent } from '../ItemEquippable';
import ItemId from '../ItemId';


export const RedEyeAmulet = new ItemEquippable({
    id: ItemId.RedEyeAmulet,
    title: 'Red Eye Amulet',
    description: `(increase chance of getting attacked while in a battle) A remarkable gem, the red-eyed sapphire is a blue crystal containing a glowing red center. The beasts and demons that took to wandering the plains after the great collapse are oddly attracted to them, as though the gems contain some form of salvation.`,
    goldValue: 300,
    slotType: 'amulet',
    onAddBonuses:(e)=>{
        e.target.stats.redEye += 3;
    }
});