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
            usage: 'inventory',
            permissionNode: PermissionId.Inventory,
            minParams: 0,
        });

        this.aliases = ['inv'];
    }

    async run(bag:CommandRunBag){
        const playerId = bag.message.author.id;
        const playerInventory = await bag.socket.getPlayerInventory(playerId);
        const playerItems = [];

        if(playerInventory){
            playerInventory.forEach((item)=>{
                const itemBase = bag.items.get(item.id);
                playerItems.push(itemBase.title+' ('+item.amount+')');
            });
        }

        bag.message.channel.sendMessage(bag.message.author.username+'\'s Items: \n'+playerItems.join(', '));
    }
}