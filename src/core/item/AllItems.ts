import ItemBase from './ItemBase';
import * as ItemsIndex from './ItemsIndex';

export default class AllItems{
    items:Map<number,ItemBase>;

    constructor(){
        this.items = new Map();

        Object.keys(ItemsIndex).forEach((itemKey)=>{
            const item:ItemBase = ItemsIndex[itemKey];
        
            this.items.set(item.id,item);
        });
    }

    get(id:number):ItemBase{
        return this.items.get(id);
    }

    findByName(name:string){
        const nameUpper = name.toUpperCase();

        for(const [itemId, item] of this.items){
            if(item.title.toUpperCase() == nameUpper){
                return item;
            }
        }
    }
}