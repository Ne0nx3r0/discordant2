import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';

export default class PartyExplore extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partyexplore',
            description: 'Create a new party',
            usage: 'partyexplore',
            permissionNode: PermissionId.PartyExplore,
            minParams: 0,
        });

        this.aliases.set('pexplore','partyexplore');
        this.aliases.set('party explore','partyexplore');
    }

    async run(bag:CommandRunBag){
        const pc = await bag.socket.getPlayer(bag.message.author.id);

        if(!pc.partyChannelId){
            throw 'You are not in a party';
        }

        if(pc.partyChannelId != bag.message.channel.id){
            throw 'Your party is at <#'+pc.partyChannelId+'>';
        }

        if(bag.params.length > 0){
            const mapName = bag.params.join(' ').toUpperCase();

            await bag.socket.setPartyExploring(bag.message.author.id,mapName);
        }
        else{
            await bag.socket.setPartyExploring(bag.message.author.id,'Western Gate');
        }
    }
}