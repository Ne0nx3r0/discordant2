import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

const leadOptions = ['wishes','wishmemory','gold','level','strength','agility','vitality','spirit','charisma','luck'];

export default class Lead extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'lead',
            description: 'Check leaderboard stats',
            usage: 'lead ['+leadOptions.join('|')+']',
            permissionNode: PermissionId.Lead,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        bag.message.channel.sendMessage('TODO: Finish leaderboards, lol');
    }
}