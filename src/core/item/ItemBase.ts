import { ItemRecipe } from './ItemRecipe';

interface ItemBaseBag{
    id:number;
    title:string;
    description:string;
    goldValue: number;
    buyCost?: number;
    showInItems?: boolean;
    recipe?:ItemRecipe;
}

export {ItemBaseBag}

export default class ItemBase{
    id:number;
    title:string;
    description:string;
    goldValue:number;
    buyCost:number;
    showInItems:boolean;
    recipe:ItemRecipe;
    
    constructor(bag:ItemBaseBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
        this.goldValue = bag.goldValue;
        this.buyCost = bag.buyCost || null;
        this.showInItems = bag.showInItems == undefined ? true : bag.showInItems;
        this.recipe = bag.recipe;
    }
}