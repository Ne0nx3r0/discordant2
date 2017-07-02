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

        this.aliases.set('pnew','partynew');
        this.aliases.set('party new','partynew');
    }

    async run(bag:CommandRunBag){
        if(bag.message.channel.id == null){
            throw 'You cannot use PMs to create a party';
        }

        const player = await bag.socket.getPlayer(bag.message.author.id);

        if(player.status == 'inParty'){
            throw `You are already in a party at <#${player.partyChannelId}>`;
        }

        if(player.status != 'inCity'){
            throw 'You cannot create a party now';
        }

        const partyName = bag.params.join(' ').replace(/ /g,'-');

        const partyChannel = await bag.bot.createPartyChannel(bag.message.guild,partyName,bag.message.author.id);

        try{
            await bag.socket.createParty(partyName,bag.message.author.id,partyChannel.id);
        }
        catch(ex){
            //Rollback channel if it fails
            partyChannel.delete();
console.log(ex);
            throw ex;
        }

        bag.message.channel.send(`Your party is ready at <#${partyChannel.id}>, ${bag.message.author.username}`);
    }
}