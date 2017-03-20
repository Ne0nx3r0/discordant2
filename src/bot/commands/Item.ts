import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import EmbedColors from '../../bot/util/EmbedColors';

export default class Item extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'item',
            description: 'Learn about an item',
            usage: 'item <itemName>',
            permissionNode: PermissionId.Item,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        if(bag.params.length < 1){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        const itemName = bag.params.join(' ');

        const item = bag.items.findByName(itemName);

        if(!item){
            bag.message.channel.sendMessage(itemName+' not found, '+bag.message.author.username);

            return;
        }

        bag.message.channel.sendMessage('',this.getEmbed(`
            ${item.title}

            ${item.description}
        `,EmbedColors.INFO));
    }
}