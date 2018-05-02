import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const LivingWoodsMapPiece = new ItemBase({
    id: ItemId.LivingWoodsMapPiece,
    title: 'Living Woods Map Piece',
    description: 'A piece of an enchanted map containing instructions on how to reach the living woods. With enough the full map can be recreated, or it can be consumed to teleport to the living woods.',
    goldValue: 15,
    showInItems: false,
});