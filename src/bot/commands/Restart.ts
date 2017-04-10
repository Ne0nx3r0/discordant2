import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import RestartRequest from '../../gameserver/socket/requests/RestartRequest';

export default class Restart extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'restart',
            description: 'Restart the bot and API server',
            usage: 'restart',
            permissionNode: PermissionId.Reset,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        bag.message.channel.sendMessage('Restarting bot & API server...');

        setTimeout(function(){
            new RestartRequest({}).send(bag.socket.sioc);

            process.exit();
        },500);
    }
}