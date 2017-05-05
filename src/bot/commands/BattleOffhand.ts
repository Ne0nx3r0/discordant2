import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import Weapon from "../../core/item/Weapon";
import WeaponAttack from '../../core/item/WeaponAttack';
import { BotAttackCommand } from "./BattleAttack";

export default class BattleAttack extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'offhand',
            description: '(during battle) send an offhand attack',
            usage: 'offhand',
            permissionNode: PermissionId.BattleAttack,
            minParams: 0,
        });

        this.aliases.set('off','offhand');
    }

    async run(bag:CommandRunBag){
        await BotAttackCommand(bag,true);
    }
}