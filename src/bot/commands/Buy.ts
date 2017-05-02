import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ParseNumber from '../../util/ParseNumber';

export default class Buy extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'buy',
            description: 'Buy an item from the town store',
            usage: 'buy <itemName> [amount]',
            permissionNode: PermissionId.Buy,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        //The last param may be part of the request or it might be a number
        const amountToBuyStr = bag.params[bag.params.length-1];
        let amountToBuy:number = ParseNumber(amountToBuyStr);
        let itemWantedStr;

        //assume everything after the first element is the item name
        if(isNaN(amountToBuy)){
            amountToBuy = 1;
            itemWantedStr = bag.params.slice(0).join(' ');
        }
        else{
            itemWantedStr = bag.params.slice(0,-1).join(' ');
        }

        const itemWanted = bag.items.findByName(itemWantedStr);

        if(!itemWanted){
            bag.message.channel.sendMessage('Unable to find '+itemWantedStr+', '+bag.message.author.username);

            return;
        }

        if(!itemWanted.buyCost){
            bag.message.channel.sendMessage(`${itemWanted.title} cannot be purchased from the town store`);

            return;
        }

        if(amountToBuy < 1){
            bag.message.channel.sendMessage('You must sell at least 1, '+bag.message.author.username);

            return;
        }

        await bag.socket.buyItem(bag.message.author.id,itemWanted,amountToBuy);

        bag.message.channel.sendMessage(`You purchase ${amountToBuy} ${itemWanted.title} from the town market for ${amountToBuy*itemWanted.buyCost}GP, ${bag.message.author.username}`);
    }
}