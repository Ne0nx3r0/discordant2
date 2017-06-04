import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Daily extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'daily',
            description: 'Get a free daily gift for playing!',
            usage: 'daily',
            permissionNode: PermissionId.Daily,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const dailyRewardMsg = await bag.socket.getDaily(bag.message.author.id);

        bag.message.channel.send(dailyRewardMsg+', '+bag.message.author.username);
    }
}