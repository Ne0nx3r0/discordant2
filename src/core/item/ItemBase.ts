interface ItemBaseBag{
    id:number;
    title:string;
    description:string;
    goldValue: number;
    buyCost?: number;
    showInItems?: boolean;
}

export {ItemBaseBag}

export default class ItemBase{
    id:number;
    title:string;
    description:string;
    goldValue:number;
    buyCost:number;
    showInItems:boolean;
    
    constructor(bag:ItemBaseBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
        this.goldValue = bag.goldValue;
        this.buyCost = bag.buyCost || null;
        this.showInItems = bag.showInItems == undefined ? true : bag.showInItems;
    }
}