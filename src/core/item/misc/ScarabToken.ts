import ItemBase from '../ItemBase';
import ItemId from '../ItemId';
import InventoryItem from "../InventoryItem";

export default new ItemBase({
    id: ItemId.ScarabToken,
    title: 'Scarab Token',
    goldValue: 40,
    description: 'A small golden scarab. Said to be the currency of an ancient civlization, these tokens still hold value among certain collectors who tend to be quite secretive about their purpose.',
});