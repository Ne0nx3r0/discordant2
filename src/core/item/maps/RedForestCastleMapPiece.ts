import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const RedForestCastleMapPiece = new ItemBase({
    id: ItemId.RedForestCastleMapPiece,
    title: 'Red Forest Castle Map Piece',
    goldValue: 20,
    description: 'A piece of the map containing instructions on how to reach the red forest castle. Can be consumed to reach the red forest castle.',
    showInItems: false,
});