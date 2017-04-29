import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class Interact extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'interact',
            description: '(while exploring) interact with a tile',
            usage: 'interact [???]',
            permissionNode: PermissionId.Lead,
            minParams: 0,
        });

        this.aliases.set('i','interact');
    }

    async run(bag:CommandRunBag){
        const pc = await bag.socket.getPlayer(bag.message.author.id);

        if(!pc.partyChannelId){
            throw 'You are not in a party';
        }

        if(pc.partyChannelId != bag.message.channel.id){
            throw 'Your party is at <#'+pc.partyChannelId+'>';
        }

        await bag.socket.interactWithCurrentTile(bag.message.author.id);
    }
}