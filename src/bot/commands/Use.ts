import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import ItemUsable from "../../core/item/ItemUsable";

export default class Use extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'use',
            description: 'Use an item',
            usage: 'use <itemName> [@target]',
            permissionNode: PermissionId.Use,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        let targetUid = this.getUserTagId(bag.params[bag.params.length-1]);

        let itemName;

        if(targetUid){
            itemName = bag.params.slice(0,-1).join(' ');
        }
        else{
            itemName = bag.params.join(' ');
            targetUid = bag.message.author.id;
        }

        const item = bag.items.findByName(itemName);

        if(!item){
            throw `Unknown item "${itemName}"`;
        }

        if(!(item instanceof ItemUsable)){
            throw `${item.title} is not a usable item`;
        }

        const useMessage = await bag.socket.useItem(bag.message.author.id,targetUid,item.id);

        //May be null
        if(useMessage){
            bag.message.channel.sendMessage(useMessage);
        }
    }
}