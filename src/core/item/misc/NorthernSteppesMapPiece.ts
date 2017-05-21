import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const NorthernSteppesMapPiece = new ItemBase({
    id: ItemId.NorthernSteppesMapPiece,
    title: 'Northern Steppes Map Piece',
    goldValue: 10,
    description: 'A piece of the map containing instructions on how to reach the northern steppes',
    showInItems: false,
});