import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class PartyDecline extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partydisband',
            description: 'Disband your current party',
            usage: 'partydisband',
            permissionNode: PermissionId.PartyNew,
            minParams: 0,
        });

        this.aliases.set('pdisband','partydisband');
        this.aliases.set('party disband','partydisband');
        this.aliases.set('disband','partydisband')
    }

    async run(bag:CommandRunBag){        
        //Note: we don't check the channel so they can leave the party from anywhere
        
        //not really much to do here since most of it is server-side checks that we would just be duplicating after making a call for the player
        await bag.socket.disbandParty(bag.message.author.id);
    }
}