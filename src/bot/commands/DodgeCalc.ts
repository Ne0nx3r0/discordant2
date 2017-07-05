import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import Weapon from '../../core/item/Weapon';
import { GetDodgePercent } from '../../util/GetDodgePercent';

export default class DodgeCalc extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'DodgeCalc',
            description: 'Calculate the DodgeCalc of a given attacker stat and agility',
            usage: 'DodgeCalc <attackerStat> <attackCharges> <defenderDodge>',
            permissionNode: PermissionId.DodgeCalc,
            minParams: 3,
        });

        this.aliases.set('dc','dodgecalc');
    }

    async run(bag:CommandRunBag){
        const attackerStat = parseInt(bag.params[0]);
        const attackCharges = parseInt(bag.params[1]);
        const defenderDodge = parseInt(bag.params[2]);

        const dodge = GetDodgePercent(attackerStat,attackCharges,defenderDodge);

        bag.message.channel.send(`With attacker stat ${attackerStat} and dodge ${defenderDodge} % dodge is **${Math.round(dodge*100)}%**`);
    }
}