import ItemEquippable, { AddBonusesEvent } from '../ItemEquippable';
import ItemId from '../ItemId';


export const RedEyeRing = new ItemEquippable({
    id: ItemId.RedEyeRing,
    title: 'Red Eye Ring',
    description: `(increase chance of getting attacked while in a battle) A remarkable gem, the red-eyed sapphire is a blue crystal containing a glowing red center. The beasts and demons that took to wandering the plains after the great collapse are oddly attracted to them, as though the gems contain some form of salvation.`,
    goldValue: 250,
    slotType:'ring',
    onAddBonuses:(e)=>{
        e.target.stats.redEye += 3;
    }
});