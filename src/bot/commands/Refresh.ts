import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import ParseNumber from '../../util/ParseNumber';

export default class Refresh extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'refresh',
            description: 'Refresh a player\'s data from the database',
            usage: 'refresh [\@username]',
            permissionNode: PermissionId.Refresh,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const tagUserId = this.getUserTagId(bag.params[0]);

        if(!tagUserId){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        

        bag.message.channel.sendMessage(`Refreshed data for player id ${tagUserId}`);
    }
}