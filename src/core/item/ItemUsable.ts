import ItemBase from './ItemBase';
import {ItemBaseBag} from './ItemBase';
import Creature from '../creature/Creature';

interface ItemUseFunction{
    (user:Creature):string;//return message to send user, may throw error if it wants
}

interface ItemCanUseFunction{
    (user:Creature);//throws an error with the reason if not usable right now
}

interface ItemUsableBag extends ItemBaseBag{
    battleExhaustion: number;
    canUse: ItemCanUseFunction;
    onUse: ItemUseFunction;
}

export default class ItemUsable extends ItemBase{
    canUse: ItemCanUseFunction;
    onUse: ItemUseFunction;
    battleExhaustion: number;

    constructor(bag:ItemUsableBag){
        super({
            id:bag.id,
            title:bag.title,
            description:bag.description
        });

        this.canUse = bag.canUse;
        this.onUse = bag.onUse;
        this.battleExhaustion = bag.battleExhaustion;
    }
}