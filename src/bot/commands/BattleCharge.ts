import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import Weapon from "../../core/item/Weapon";
import WeaponAttack from '../../core/item/WeaponAttack';

export default class BattleCharge extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'charge',
            description: '(during battle) collect ambient energy to power a legend',
            usage: 'charge',
            permissionNode: PermissionId.BattleCharge,
            minParams: 0,
        });

        this.aliases.set('c','charge');
    }

    async run(bag:CommandRunBag){
        await bag.socket.sendBattleCharge(bag.message.author.id);
    }
}