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
        const timeMS = Date.now() - bag.message.createdAt.getTime();

        if(bag.params[0] == 'localhost' || bag.params[0] == '127.0.0.1' || bag.params[0] == '::1'){
            bag.message.channel.send(`There's no place like home...`);

            return;
        }

        const time = Math.round(timeMS/10)/100;

        bag.message.channel.send(`Pong! (${time}s)`);
    }
}