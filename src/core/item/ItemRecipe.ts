import ItemId from './ItemId';

export interface ItemRecipe{
    components:Array<{
        itemId: ItemId,
        amount: number,
    }>;
    wishes: number;
}