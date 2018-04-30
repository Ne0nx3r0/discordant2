import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class PartyReturn extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partyreturn',
            description: 'return your current party',
            usage: 'partyreturn',
            permissionNode: PermissionId.PartyReturn,
            minParams: 0,
        });

        this.aliases.set('preturn','partyreturn');
        this.aliases.set('party return','partyreturn');
        this.aliases.set('return','partyreturn')
    }

    async run(bag:CommandRunBag){        
        //Note: we don't check the channel so they can leave the party from anywhere
        
        //not really much to do here since most of it is server-side checks that we would just be duplicating after making a call for the player
        await bag.socket.returnParty(bag.message.author.id);
    }
}