import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const RedForestCastleMap = new ItemBase({
    id: ItemId.RedForestCastleMap,
    title: 'Red Forest Castle Map',
    goldValue: 200,
    description: 'A map of the Red Forest Castle',
    showInItems: false,
    recipe: {
        components: [{
            itemId: ItemId.RedForestCastleMapPiece,
            amount: 10,
        }],
        wishes: 100,
    }
});