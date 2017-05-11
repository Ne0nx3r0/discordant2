import Command, { CommandBag, CommandRunBag } from "../Command";
import PermissionId from '../../core/permissions/PermissionId';

export default class Items extends Command {
    constructor(bag:CommandBag){
        super({
            name: 'items',
            description: 'List in-game items',
            usage: 'item <itemName>',
            permissionNode: PermissionId.Items,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const itemsList = [];

        bag.items.items.forEach(function(item){
            if(item.showInItems){
                itemsList.push(item.title);
            }
        });

        itemsList.sort(function(a,b){
            return a.localeCompare(b);
        });

        const itemsListStr = itemsList.join(', ');

        bag.message.channel.sendMessage(`Here are the known items: \n${itemsListStr}`);
    }
}