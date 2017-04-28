interface ItemBaseBag{
    id:number;
    title:string;
    description:string;
    goldValue: number;
}

export {ItemBaseBag}

export default class ItemBase{
    id:number;
    title:string;
    description:string;
    goldValue:number;
    
    constructor(bag:ItemBaseBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
        this.goldValue = bag.goldValue;
    }
}