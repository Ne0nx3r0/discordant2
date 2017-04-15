import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ParseNumber from '../../util/ParseNumber';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'grant',
            description: 'Create an item for a player',
            usage: 'grant <\@username> <item name|wishes|gold> [amount]',
            permissionNode: PermissionId.Grant,
            minParams: 2,
        });
    }

    async run(bag:CommandRunBag){
        const tagUserId = bag.message.mentions.users.first().id;

        if(!tagUserId){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        const giveTo = await bag.socket.getPlayer(tagUserId);

        if(!giveTo){
            bag.message.channel.sendMessage(this.getUsage());

            return;
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

        if(itemWantedStr == 'wishes'){
            const newWishAmount = await bag.socket.grantWishes(giveTo.uid,amountWanted);

            bag.message.channel.sendMessage(`${bag.message.author.username} created ${amountWanted} wishes for ${giveTo.title}`);
        }
        else if(itemWantedStr == 'gold'){
            const newXPAmount = await bag.socket.grantGold(giveTo.uid,amountWanted);

            bag.message.channel.sendMessage(`${bag.message.author.username} created ${amountWanted} gold for ${giveTo.title}`);
        }
        else{//an item
            const itemWanted = bag.items.findByName(itemWantedStr);

            if(!itemWanted){
                bag.message.channel.sendMessage('Unable to find '+itemWantedStr+', '+bag.message.author.username);

                return;
            }

            if(amountWanted < 1){
                bag.message.channel.sendMessage('You cannot give someone a negative item, '+bag.message.author.username);

                return;
            }

            const newItemAmount = await bag.socket.grantItem(giveTo.uid,itemWanted,amountWanted);
        
            bag.message.channel.sendMessage(`${bag.message.author.username} created ${amountWanted} ${itemWanted.title} for ${giveTo.title}`);
        }
    }
}