import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const RedForestMapPiece = new ItemBase({
    id: ItemId.RedForestMapPiece,
    title: 'Red Forest Map Piece',
    goldValue: 10,
    description: 'A piece of the map containing instructions on how to reach the red forest. Can be consumed to reach the red forest.',
    showInItems: false,
});