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

        if(amountWanted < 1){
            amountWanted = 1;
        }

        const item = bag.items.findByName(itemWantedStr);

        if(!item){
            throw `Unknown item ${itemWantedStr}`;
        }

        if(!item.recipe){
            throw `${item.title} has no known recipe`;
        }

        await bag.socket.craftItem(bag.message.author.id,item.id,amountWanted);

        const componentsStr = item.recipe.components.map(function(component){
            return component.amount + ' ' + bag.items.get(component.itemId).title;
        })
        .join(', ');

        bag.message.channel.sendMessage(`Used ${item.recipe.wishes} ${item.recipe.wishes == 1 ? 'wish' : 'wishes'} to transform ${componentsStr} into **${amountWanted} ${item.title}**, ${bag.message.author.username}`);
    }
}