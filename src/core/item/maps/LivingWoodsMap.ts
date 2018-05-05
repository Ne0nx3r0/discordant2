import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const LivingWoodsMap = new ItemBase({
    id: ItemId.GoblinSneakPoisonWeapon,
    title: 'Living Woods Map',
    goldValue: 1000,
    description: 'An enchanted map containing the legend of the living woods. Can be used to teleport to the living woods.',
    recipe: {
        components: [{
            itemId: ItemId.LivingWoodsMapPiece,
            amount: 10,
        }],
        wishes: 500,
    },
    showInItems: false,
});
