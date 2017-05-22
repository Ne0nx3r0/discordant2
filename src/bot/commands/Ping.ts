import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';

export default class Pong extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'ping',
            description: 'Check bot response time',
            usage: 'ping',
            permissionNode: PermissionId.Ping,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const time = Date.now() - bag.message.createdTimestamp;
        bag.message.channel.sendMessage(`Pong! (${time}ms)`);
    }
}