import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export const ScarabToken = new ItemBase({
    id: ItemId.FireAntCarapace,
    title: 'Fire Ant Carapace',
    goldValue: 25,
    description: 'A piece of a giant fire ant shell. With enough of them, it should be possible to fashion some armor',
    showInItems: false,
});