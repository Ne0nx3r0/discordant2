import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Pass extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'run',
            description: '(During battle) Attempt to run away from a battle',
            usage: 'run',
            permissionNode: PermissionId.BattleRun,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){        
        const player = await bag.socket.getPlayer(bag.message.author.id);

        if(player.status != 'inBattle'){
            throw 'You are not currently in a battle';
        }

        if(bag.message.channel.id != player.battleChannelId){
            throw `Your battle is in <#${player.battleChannelId}>`;
        }

        await bag.socket.sendBattleRun(bag.message.author.id);
    }
}