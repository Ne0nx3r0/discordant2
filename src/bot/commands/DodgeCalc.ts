import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import Weapon from '../../core/item/Weapon';
import CalculateDamagePerRound from '../../util/CalculateDamagePerRound';
import { GetDodgePercent } from '../../util/GetDodgePercent';

export default class DodgeCalc extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'DodgeCalc',
            description: 'Calculate the DodgeCalc of a given attacker stat and agility',
            usage: 'DodgeCalc <attackerStat> <defenderAgility>',
            permissionNode: PermissionId.DodgeCalc,
            minParams: 2,
        });
    }

    async run(bag:CommandRunBag){
        const attackerStat = parseInt(bag.params[0]);
        const defenderAgility = parseInt(bag.params[1]);

        const dodge = GetDodgePercent(attackerStat,defenderAgility);

        bag.message.channel.sendMessage(`With attacker stat ${attackerStat} and AGL ${defenderAgility} dodge is **${Math.round(dodge*100)}%**`);
    }
}