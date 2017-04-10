import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class PartyExplore extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partyexplore',
            description: 'Create a new party',
            usage: 'partyexplore',
            permissionNode: PermissionId.PartyExplore,
            minParams: 0,
        });

        this.aliases = ['pexplore'];
    }

    async run(bag:CommandRunBag){
        //not really much to do here since most of it is server-side checks that we would just be duplicating after making a call for the player

        await bag.socket.setPartyExploring(bag.message.author.id);
    }
}