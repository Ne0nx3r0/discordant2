import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export enum LeadPlayerOption{wishes,gold,level,strength,agility,vitality,spirit,luck};
const LeadPlayerOptions = ['wishes','gold','level','strength','agility','vitality','spirit','luck'];

export default class Top extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'top',
            description: 'Check leaderboard stats',
            usage: 'top ['+LeadPlayerOptions.join('|')+']',
            permissionNode: PermissionId.Lead,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const leadOptionStr = bag.params[0];
        const leadOption = LeadPlayerOption[leadOptionStr];

        if(leadOption === undefined){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        const topPlayers = await bag.socket.getTopPlayers(leadOption);

        bag.message.channel.sendMessage(`Top players by ${leadOptionStr}
${topPlayers.map(function(p){return p.title + ' - ' + p.amount;}).join('\n')}`);
    }
}