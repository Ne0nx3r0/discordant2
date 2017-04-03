import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class PartyNew extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partynew',
            description: 'Create a new party',
            usage: 'partynew <name>',
            permissionNode: PermissionId.PartyNew,
            minParams: 1,
        });

        this.aliases = ['dpn','dpnew'];
    }

    async run(bag:CommandRunBag){
        const player = await bag.socket.getPlayer(bag.message.author.id);

        if(player.status != 'inCity'){
            throw 'You cannot create a party now';
        }

        const partyName = bag.params.join(' ').replace(/ /g,'-');

        const partyChannel = await bag.handlers.createPartyChannel(bag.message.guild,partyName,bag.message.author.id);

        try{
            await bag.socket.createParty(bag.message.author.id);
        }
        catch(ex){
            //Rollback channel if it fails
            partyChannel.delete();

            throw ex;
        }

        bag.message.channel.sendMessage(`Your party is ready at <#${partyChannel.id}>, ${bag.message.author.username}`);
    }
}