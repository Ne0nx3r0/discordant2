import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const MapNorthernSteppes = new ItemBase({
    id: ItemId.MapNorthernSteppes,
    title: 'Map to The Northern Steppes',
    goldValue: 25,
    description: 'A map containing instructions on how to reach the northern steppes',
    showInItems: false,
});