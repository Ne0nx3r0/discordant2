import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const MapAfterRedForest = new ItemBase({
    id: ItemId.MapAfterRedForest,
    title: 'Map After Red Forest',
    goldValue: 100,
    description: '<Coming soon!>',
    recipe: {
        components: [{
            itemId: ItemId.RedForestMapPiece,
            amount: 10,
        }],
        wishes: 100,
    },
    showInItems: false,
});