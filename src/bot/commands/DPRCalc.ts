import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import Weapon from '../../core/item/Weapon';
import CalculateDamagePerRound, { CalculateDamagePerRoundDirectly } from '../../util/CalculateDamagePerRound';

export default class DPR extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'dprcalc',
            description: 'Calculate the DPR of a given set of criteria',
            usage: 'dpr <min> <max> <charges> <critMultiplier> <critChance>',
            permissionNode: PermissionId.DPR,
            minParams: 5,
        });
    }

    async run(bag:CommandRunBag){
        const dpr = CalculateDamagePerRoundDirectly(
            Number(bag.params[0]),
            Number(bag.params[1]),
            Number(bag.params[2])+1,
            Number(bag.params[3]),
            Number(bag.params[4])
        );

        bag.message.channel.send(`${dpr}, ${bag.message.author.username}`);
    }
}