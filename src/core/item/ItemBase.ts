interface ItemBaseBag{
    id:number;
    title:string;
    description:string;
}

export {ItemBaseBag}

export default class ItemBase{
    id:number;
    title:string;
    description:string;
    
    constructor(bag:ItemBaseBag){
        this.id = bag.id;
        this.title = bag.title;
        this.description = bag.description;
    }
}