import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const RedMushroom = new ItemBase({
    id: ItemId.RedMushroom,
    title: 'Red Mushroom',
    goldValue: 20,
    description: 'A small red mushroom, usually found in dark and humid areas. Useful in crafting.',
    showInItems: true,
});