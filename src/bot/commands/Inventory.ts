import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'inventory',
            description: 'Show your inventory',
            usage: 'inventory [page#]',
            permissionNode: PermissionId.Inventory,
            minParams: 0,
        });

        this.aliases.set('inv','inventory');
    }

    async run(bag:CommandRunBag){
        let page = parseInt(bag.params[0]);

        if(isNaN(page) || page < 1){
            page = 1;
        }

        const playerId = bag.message.author.id;
        const playerInventory = await bag.socket.getPlayerInventory(playerId);

        const playerItems = [];
        
        if(playerInventory){
            playerInventory.sort(function(a,b){
                return bag.items.get(a.id).title.localeCompare(bag.items.get(b.id).title);
            });

            const inventorySlice = playerInventory.slice(10 * (page-1), 10 * (page-1) + 10);
            
            let maxSpacer = 0;

            inventorySlice.forEach((item)=>{
                maxSpacer = Math.max(maxSpacer,getIntLength(item.amount));
            });

            inventorySlice.forEach((item)=>{
                const itemBase = bag.items.get(item.id);

                let spaceCount = maxSpacer-getIntLength(item.amount);
                let spacer = ' '.repeat(spaceCount > -1 ? spaceCount : 0);

                playerItems.push('< = '+spacer+item.amount+' '+itemBase.title+' >');
            });
        }

        bag.message.channel.sendMessage('```xml\n'+bag.message.author.username+'\'s Items (Page #'+page+'): \n'+playerItems.join('\n')+'\n```');
    }
}

function getIntLength(num:number){
    return Math.ceil(Math.log(num + 1) / Math.LN10);
}