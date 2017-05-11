import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const AlphaKey = new ItemBase({
    id: ItemId.AlphaKey,
    title: 'Alpha Key',
    goldValue: 1000,
    description: 'A small clear key composed of largely triangular crystals which project strange rainbowlike patterns across the ground when held up to a light.\n\nWhatever is it for?',
    showInItems: false,
});