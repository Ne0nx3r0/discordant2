import InventoryItem from './InventoryItem';
import ItemBase from './ItemBase';
import { SocketInventoryItem } from './InventoryItem';

export interface DBItemBag{
    id:number;
    amount:number;
}

export default class PlayerInventory{
    items: Map<number,InventoryItem>;

    constructor(items?:Map<number,InventoryItem>){
        this.items = items || new Map();
    }

    //TODO: Remember to update this to account for metadata when metadata is implemented
    _addItem(base:ItemBase,amount:number){
        const existingItem:InventoryItem = this.items.get(base.id);

        if(existingItem){
            existingItem.amount += amount;
        }
        else{
            this.items.set(base.id,new InventoryItem(base,amount));
        }
    }

    _removeItem(base:ItemBase,amount:number){
        const existingItem:InventoryItem = this.items.get(base.id);

        //Really these two checks should have already been run
        //but this may prevent a duping exploit
        if(!existingItem){
            throw 'Item not in inventory: '+base.id+' ('+base.title+') '+amount;
        }
        else if(amount > existingItem.amount){
            throw 'Only '+existingItem.amount+' of '+base.id+' ('+base.title+') in inventory, less than '+amount;
        }
        else if(amount == existingItem.amount){
            this.items.delete(base.id);
        }
        else{
            existingItem.amount = existingItem.amount - amount;
        }
    }

    hasItem(itemBase:ItemBase,amount:number):boolean{
        const item = this.items.get(itemBase.id);
        
        if(item){
            return item.amount >= amount;
        }

        return false;
    }

    getItemAmount(item:ItemBase){
        const it = this.items.get(item.id);

        if(!it){
            return 0;
        }

        return it.amount;
    }

    toDatabase():Array<DBItemBag>{
        const dbItems:Array<DBItemBag> = [];

        this.items.forEach((item)=>{
            dbItems.push({
                id: item.base.id,
                amount: item.amount
            });
        });

        return dbItems;
    }

    toSocket():SocketPlayerInventory{
        const inventoryItems:SocketPlayerInventory = [];

        this.items.forEach(function(item,itemId){
            inventoryItems.push({
                id:item.base.id,
                amount:item.amount
            });
        });

        return inventoryItems;
    }
}

export type SocketPlayerInventory = Array<SocketInventoryItem>;