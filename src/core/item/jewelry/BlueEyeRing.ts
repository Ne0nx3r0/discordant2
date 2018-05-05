import ItemEquippable, { AddBonusesEvent } from '../ItemEquippable';
import ItemId from '../ItemId';


export const BlueEyeRing = new ItemEquippable({
    id: ItemId.BlueEyeRing,
    title: 'Blue Eye Ring',
    description: `(decrease chance of getting attacked while in a battle) Said to be the wish remains of an unrequited lover who fell during the great collapse, blue-eyed diamonds absorb light around themselves and those who hold it. As a side effect, monsters are less likely to see you during a battle.`,
    goldValue: 250,
    slotType:'ring',
    onAddBonuses:(e)=>{
        e.target.stats.redEye = Math.max(1, e.target.stats.redEye - 1 );
    }
});