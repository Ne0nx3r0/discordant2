import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class SetRole extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'lockdown',
            description: 'Bot will only respond to owners until the bot is reset',
            usage: 'lockdown',
            permissionNode: PermissionId.Lockdown,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        bag.bot.setLockdown(true);
        
        bag.message.channel.send(`Bot is now on lockdown mode, ${bag.message.author.username}`);
    }
}