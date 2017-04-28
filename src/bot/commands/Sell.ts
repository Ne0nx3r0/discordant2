import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ParseNumber from "../../util/ParseNumber";

export default class Sell extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'sell',
            description: '(While in city) Sell an item to the local shops',
            usage: 'sell <itemName> [amount]',
            permissionNode: PermissionId.Sell,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        //The last param may be part of the request or it might be a number
        const amountToSellStr = bag.params[bag.params.length-1];
        let amountToSell:number = ParseNumber(amountToSellStr);
        let itemWantedStr;

        //assume everything after the first element is the item name
        if(isNaN(amountToSell)){
            amountToSell = 1;
            itemWantedStr = bag.params.slice(1).join(' ');
        }
        else{
            itemWantedStr = bag.params.slice(1,-1).join(' ');
        }

        const itemWanted = bag.items.findByName(itemWantedStr);

        if(!itemWanted){
            bag.message.channel.sendMessage('Unable to find '+itemWantedStr+', '+bag.message.author.username);

            return;
        }

        if(amountToSell < 1){
            bag.message.channel.sendMessage('You cannot sell a negative item, '+bag.message.author.username);

            return;
        }

        await bag.socket.sellItem(bag.message.author.id,itemWanted,amountToSell);

        bag.message.channel.sendMessage(`${bag.message.author.username} sold ${amountToSell} ${itemWanted.title} for ${amountToSell*itemWanted.goldValue}GP`);
    }
}