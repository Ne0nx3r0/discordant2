import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class SetDesc extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'setdesc',
            description: 'Set your player description',
            usage: 'setdesc <description text>',
            permissionNode: PermissionId.SetDescription,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const description = bag.params.join(' ');

        if(description.length > 255){
            throw `Description too long`;
        }

        await bag.socket.setPlayerDescription(bag.message.author.id,description);

        bag.message.channel.send(`Your description has been updated, ${bag.message.author.username}`);
    }
}