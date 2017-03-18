import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'inv',
            description: 'Show your inventory',
            usage: 'inv',
            permissionNode: PermissionId.Inventory,
            minParams: 0,
        });
    }

    run(bag:CommandRunBag){
        (async()=>{
            try{
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
            catch(ex){
                bag.message.channel.sendMessage(`${ex}, ${bag.message.author.username}`);
            }
        })();
    }
}