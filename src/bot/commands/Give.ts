import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ParseNumber from '../../util/ParseNumber';

export default class Give extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'give',
            description: 'Give a player an item',
            usage: 'give <\@username> <item name> [amount]',
            permissionNode: PermissionId.Give,
            minParams: 2,
        });
    }

    async run(bag:CommandRunBag){
        const tagUserId = this.getUserTagId(bag.params[0]);

        if(!tagUserId){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        const giveTo = await bag.socket.getPlayer(tagUserId);

        if(!giveTo){
            throw `That player has not registered yet`;
        }

        //The last param may be part of the request or it might be a number
        const amountWantedStr = bag.params[bag.params.length-1];
        let amountWanted:number = ParseNumber(amountWantedStr);
        let itemWantedStr;

        //assume everything after the first element is the item name
        if(isNaN(amountWanted)){
            amountWanted = 1;
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

        if(amountWanted < 1){
            bag.message.channel.sendMessage('You cannot give someone a negative item, '+bag.message.author.username);

            return;
        }

        const newItemAmount = await bag.socket.transferItem({
            fromUid: bag.message.author.id,
            toUid: giveTo.uid,
            itemId: itemWanted.id,
            amount: amountWanted,
        });
    
        bag.message.channel.sendMessage(`${bag.message.author.username} gave ${giveTo.title} ${amountWanted} ${itemWanted.title}`);
    }
}