import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class PartyDecline extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partykick',
            description: 'Kick a player from the party',
            usage: 'partykick',
            permissionNode: PermissionId.PartyKick,
            minParams: 1,
        });

        this.aliases.set('pkick','partykick');
    }

    async run(bag:CommandRunBag){
        const taggedUserId = this.getUserTagId(bag.params[0]);

        if(!taggedUserId){
            bag.message.channel.send(this.getUsage());

            return;
        }
        
        //not really much to do here since most of it is server-side checks that we would just be duplicating after making a call for the player
        await bag.socket.kickPartyMember(bag.message.author.id,taggedUserId);
    }
}