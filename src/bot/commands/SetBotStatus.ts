import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'setbotstatus',
            description: 'Sets the bot playing message',
            usage: 'setbotstatus <message>',
            permissionNode: PermissionId.SetPlayingGame,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const status = bag.params.join(' ');

        bag.handlers.setPlayingGame(status);

        bag.message.channel.sendMessage(`Set current game to "${status}", ${bag.message.author.username}`);
    }
}