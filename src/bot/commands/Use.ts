import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import ItemUsable from "../../core/item/ItemUsable";

export default class Use extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'use',
            description: 'Use an item',
            usage: 'use <itemName>',
            permissionNode: PermissionId.Use,
            minParams: 2,
        });
    }

    async run(bag:CommandRunBag){
        const itemName = bag.params.join(' ');

        const item = bag.items.findByName(itemName);

        if(!item){
            throw `Unknown item "${itemName}"`;
        }

        if(!(item instanceof ItemUsable)){
            throw `${item.title} is not a usable item, ${bag.message.author.username}`;
        }

        const useMessage = await bag.socket.useItem(bag.message.author.id,item.id);

        bag.message.channel.sendMessage(useMessage);
    }
}