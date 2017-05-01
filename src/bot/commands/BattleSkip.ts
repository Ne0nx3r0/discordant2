import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Pass extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'skip',
            description: '(During battle) skip your turn of you are the party leader skip another party member\'s turn',
            usage: 'skip [@user]',
            permissionNode: PermissionId.Pass,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){        
        let skipUid = this.getUserTagId(bag.params[0]);

        if(!skipUid){
            skipUid = bag.message.author.id;
        }

        const player = await bag.socket.getPlayer(bag.message.author.id);

        if(player.status != 'inBattle'){
            throw 'You are not currently in a battle';
        }

        if(bag.message.channel.id != player.battleChannelId){
            throw `Your battle is in <#${player.battleChannelId}>`;
        }

        await bag.socket.sendBattleSkip(bag.message.author.id,skipUid);
    }
}