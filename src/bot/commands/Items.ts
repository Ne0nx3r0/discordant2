import Command, { CommandBag, CommandRunBag } from "../Command";
import PermissionId from '../../core/permissions/PermissionId';
import ItemBase from '../../core/item/ItemBase';
import AllItems from '../../core/item/AllItems';

export default class Items extends Command {
    itemStrs:Array<string>;
    
    constructor(bag:CommandBag){
        super({
            name: 'items',
            description: 'List or search through in-game items',
            usage: 'items [page#]',
            permissionNode: PermissionId.Items,
            minParams: 0,
        });

        const items = new AllItems();

        this.itemStrs = [];

        items.items.forEach((item)=>{
            if(item.showInItems){
                this.itemStrs.push('< '+item.title + ' = '+item.goldValue+'GP >');
            }
        });

        this.itemStrs.sort(function(a,b){
            return a.localeCompare(b);
        });
    }

    async run(bag:CommandRunBag){
        let page = parseInt(bag.params[0]);

        if(isNaN(page)){
            page = 1;
        }

        const itemsListStr = this.itemStrs.slice(10 * (page-1), 10 * (page-1) + 9)
        .join('\n');

        const maxPage = Math.ceil(bag.items.items.size / 10); 

        bag.message.channel.sendMessage(`\`\`\`xml\nItems & sell prices - Page ${page} of ${maxPage}\n${itemsListStr}\n\`\`\``);
    }
}

