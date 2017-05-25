import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ParseNumber from '../../util/ParseNumber';

export default class SetRole extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'craft',
            description: 'Craft an item',
            usage: 'craft <item name> [amount]',
            permissionNode: PermissionId.Craft,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        //The last param may be part of the request or it might be a number
        const amountWantedStr = bag.params[bag.params.length-1];
        let amountWanted:number = ParseNumber(amountWantedStr);
        let itemWantedStr;

        //assume everything after the first element is the item name
        if(isNaN(amountWanted)){
            amountWanted = 1;
            itemWantedStr = bag.params.slice(0).join(' ');
        }
        else{
            itemWantedStr = bag.params.slice(0,-1).join(' ');
        }

        const item = bag.items.findByName(itemWantedStr);

        if(!item){
            throw `Unknown item ${itemWantedStr}`;
        }

        if(!item.recipe){
            throw `${item.title} has no known recipe`;
        }

        await bag.socket.craftItem(bag.message.author.id,item.id,amountWanted);

        bag.message.channel.sendMessage(`Crafted ${amountWanted} ${item.title}, ${bag.message.author.username}`);
    }
}