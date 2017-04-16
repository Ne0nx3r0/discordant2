import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';

export default class SetRole extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'wish',
            description: 'Use wishes to take an action',
            usage: 'wish <strength|agility|vitality|>',
            permissionNode: PermissionId.SetRole,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){

    }
}