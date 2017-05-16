import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';

export default class Pong extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'pong',
            description: 'Check bot response time',
            usage: 'pong',
            permissionNode: PermissionId.Ping,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        bag.message.channel.sendMessage(`Pong!`);
    }
}