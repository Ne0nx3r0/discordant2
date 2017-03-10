import ItemBase from './ItemBase';

export default class InventoryItem{
    base:ItemBase;
    amount:number;

    //TODO: implement item metadata here

    constructor(base:ItemBase,amount:number){
        this.base = base;
        this.amount = amount;
    }
}