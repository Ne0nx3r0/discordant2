import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';

export default class Heal extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'Heal',
            description: 'Uses vials until you are healed',
            usage: 'heal',
            permissionNode: PermissionId.Heal,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const result = await bag.socket.autoHeal(bag.message.author.id);

        bag.message.channel.send(`${bag.message.author.username} used ${result.vialsUsed} and healed to ${result.hpCurrent}/${result.hpTotal}! `);
    }
}