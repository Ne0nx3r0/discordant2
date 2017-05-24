import ItemBase from './ItemBase';
import {ItemBaseBag} from './ItemBase';
import Creature from '../creature/Creature';

interface ItemUseFunction{
    (user:Creature,target:Creature):string;//return message to send user, may throw error if it wants
}

interface ItemCanUseFunction{
    (user:Creature,target:Creature);//throws an error with the reason if not usable right now
}

interface ItemUsableBag extends ItemBaseBag{
    battleExhaustion?: number;
    canUse?: ItemCanUseFunction;
    onUse: ItemUseFunction;
    canUseInbattle:boolean;
    canUseInParty:boolean;
}

export default class ItemUsable extends ItemBase{
    canUse: ItemCanUseFunction;
    canUseInbattle:boolean;
    canUseInParty:boolean;
    onUse: ItemUseFunction;
    battleExhaustion: number;

    constructor(bag:ItemUsableBag){
        super(bag);

        this.canUseInbattle = bag.canUseInbattle;
        this.canUseInParty = bag.canUseInParty;
        this.canUse = bag.canUse;
        this.onUse = bag.onUse;
        this.battleExhaustion = bag.battleExhaustion || 0;
    }
}