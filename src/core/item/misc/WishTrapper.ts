import ItemEquippable from '../ItemEquippable';
import ItemId from '../ItemId';

export const WishTrapper = new ItemEquippable({
    id: ItemId.WishTrapper,
    title: 'Wish Trapper',
    description: `(Wishes retained on death, but the item breaks) A curious device intended to retain the wishes of its carrier in situations where the wishes would normally escape and become wild, ingrained in the surrounding flora and fauna.`,
    goldValue: 500,
    showInItems: true,
    slotType: 'pouch',
    lostOnDeath: true,
    onAddBonuses: (e)=>{
        e.target.stats.wishProtect += 1;
    }
});