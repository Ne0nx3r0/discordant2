import ItemBase from './ItemBase';
import * as ItemsIndex from './ItemsIndex';
import * as Fuse from 'fuse.js';

export default class AllItems{
    fuse: Fuse;
    items:Map<number,ItemBase>;

    constructor(){
        this.items = new Map();
        const itemsFuse:ItemBase[] = [];

        Object.keys(ItemsIndex).forEach((itemKey)=>{
            const item:ItemBase = ItemsIndex[itemKey];
        
            this.items.set(item.id,item);
            itemsFuse.push(item);
        });

        this.fuse = new Fuse(itemsFuse,{
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 3,
            keys: [
                "title",
                "id",
            ],
        });
    }

    get(id:number):ItemBase{
        return this.items.get(id);
    }

    findByName(name:string):ItemBase | null{
        if(!name) return null;

        const nameUpper = name.toUpperCase();

        for(const [itemId, item] of this.items){
            if(item.title.toUpperCase().indexOf(nameUpper)> -1){
                return item;
            }
        }
    }

    findByNameFuzzy(name:string):ItemBase | null{
        if(!name) return null;

        const results = this.fuse.search(name);

        console.log(results);

        console.log(results[0]);

        return results[0] as ItemBase || null;
    }
}