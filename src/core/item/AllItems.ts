import ItemBase from './ItemBase';
import * as ItemsIndex from './ItemsIndex';
import * as Fuse from 'fuse.js';

interface FuseResult{
    id: number;
    title: string;
}

export default class AllItems{
    fuse: Fuse;
    items:Map<number,ItemBase>;

    constructor(){
        this.items = new Map();
        const itemsFuse:FuseResult[] = [];

        Object.keys(ItemsIndex).forEach((itemKey)=>{
            const item:ItemBase = ItemsIndex[itemKey];
        
            this.items.set(item.id,item);
            
            itemsFuse.push({
                id: item.id,
                title: item.title,
            });
        });

        this.fuse = new Fuse(itemsFuse,{
            shouldSort: true,
            threshold: 0.4,
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
        
        if(results.length < 1){
            return null;
        }

        const resultId:number = (results[0] as FuseResult).id;

        return this.items.get(resultId);
    }
}