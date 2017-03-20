import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Inventory extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'shutdown',
            description: 'Shut the bot down (it might just restart)',
            usage: 'shutdown',
            permissionNode: PermissionId.Shutdown,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        bag.message.channel.sendMessage('Shutting down...');

        setTimeout(function(){
            process.exit();
        },500);
    }
}