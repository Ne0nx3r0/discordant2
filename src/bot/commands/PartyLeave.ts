import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class PartyDecline extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partyleave',
            description: 'Leave your current party',
            usage: 'partyleave',
            permissionNode: PermissionId.PartyLeave,
            minParams: 0,
        });

        this.aliases = ['partyl','pl'];
    }

    async run(bag:CommandRunBag){
        //not really much to do here since most of it is server-side checks that we would just be duplicating after making a call for the player
        await bag.socket.leaveParty(bag.message.author.id);
    }
}