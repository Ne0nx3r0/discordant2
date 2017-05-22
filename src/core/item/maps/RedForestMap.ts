import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const RedForestMap = new ItemBase({
    id: ItemId.RedForestMap,
    title: 'Red Forest Map',
    goldValue: 100,
    description: 'A map of the Red Forest',
    showInItems: false,
});