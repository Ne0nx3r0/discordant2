import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import Weapon from '../../core/item/Weapon';
import CalculateDamagePerRound from '../../util/CalculateDamagePerRound';

export default class DPR extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'pr',
            description: 'Calculate the DPR of a given weapon',
            usage: 'pr <item name>',
            permissionNode: PermissionId.DPR,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const weaponName = bag.params.join(' ');

        const item = bag.items.findByNameFuzzy(weaponName);

        if(!item){
            throw 'Unknown item '+weaponName;
        }

        if(!(item instanceof Weapon)){
            throw weaponName+' is not a weapon';
        }

        const weapon = item as Weapon;

        let statRequirementsTotal = 0;
        
        if(Object.keys(weapon.useRequirements).length > 0){
            statRequirementsTotal += Object
            .keys(weapon.useRequirements)
            .map(function(key){
                return weapon.useRequirements[key];
            })
            .reduce(function(a,b){
                return a + b;
            });
        }

        const dprs = weapon.attacks.map(function(attack){
            const dpr = Math.round(CalculateDamagePerRound(attack)*100)/100;
            const statdpr = Math.round( ( statRequirementsTotal / dpr ) * 100) / 100;

            return `${attack.title}: DPR ${dpr} / Stats ${statRequirementsTotal} = ${statdpr} StatDPR'`;
        }).join('\n');

        bag.message.channel.send(`The DPRs for ${weapon.title}'s attacks are:\n${dprs}`);
    }
}