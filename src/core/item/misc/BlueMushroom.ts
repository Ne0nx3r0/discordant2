import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const BlueMushroom = new ItemBase({
    id: ItemId.BlueMushroom,
    title: 'Blue Mushroom',
    goldValue: 20,
    description: 'A rare blue mushroom, usually found in dark and humid areas. Useful in crafting.',
    showInItems: true,
});