import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const WishCatcher = new ItemEquippable({
    id: ItemId.WishCatcher,
    title: 'Wish Catcher',
    description: `(2% bonus to wishes earned) As wishes replaced gold as the de facto currency of the land, greedy collectors comissioned these strange white orbs which aided them in the collection of wild wishes.`,
    goldValue: 250,
    showInItems: true,
    slotType:'pouch',
    onAddBonuses:(e)=>{
        e.target.stats.wishBonus += 0.02;
    }
});