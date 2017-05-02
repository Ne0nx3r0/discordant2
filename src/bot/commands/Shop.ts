import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ItemBase from '../../core/item/ItemBase';

export default class Shop extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'shop',
            description: 'List items for sale in the town shop',
            usage: 'shop',
            permissionNode: PermissionId.Shop,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const forSaleItems:Array<ItemBase> = [];

        bag.items.items.forEach(function(item){
            if(item.buyCost){
                forSaleItems.push(item);
            }
        });

        bag.message.channel.sendMessage(`The town shop has these items for sale:\n\n`+forSaleItems.map(function(item){
            return item.title + ' - ' + item.buyCost + 'GP';
        }).join('\n'));
    }
}