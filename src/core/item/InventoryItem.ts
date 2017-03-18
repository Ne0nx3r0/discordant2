import ItemBase from './ItemBase';

export default class InventoryItem{
    base:ItemBase;
    amount:number;

    constructor(base:ItemBase,amount:number){
        this.base = base;
        this.amount = amount;
    }

    toSocket():SocketInventoryItem{
        return {
            id: this.base.id,
            amount: this.amount,
        };
    }
}

export interface SocketInventoryItem {
    id:number;
    amount:number;
}
