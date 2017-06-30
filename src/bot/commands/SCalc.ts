import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import GetEarnedWishes from '../../util/GetEarnedWishes';
import Weapon from '../../core/item/Weapon';
import CalculateDamagePerRound, { CalculateDamagePerRoundDirectly } from '../../util/CalculateDamagePerRound';
import { CalculateScalingBonus, DamageScaling } from '../../core/damage/DamageScaling';
import { ScalingLevel } from '../../core/item/WeaponAttack';
import { Attribute } from '../../core/creature/AttributeSet';

export default class SCalc extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'scalc',
            description: 'Calculate the proposed new scaling for a given item',
            usage: 'scalc <item name>',
            permissionNode: PermissionId.SCalc,
            minParams: 1,
        });
    }

    async run(bag:CommandRunBag){
        const itemName = bag.params.join(' ');

        const item = bag.items.findByName(itemName);

        if(!item){
            throw 'Unknown item';
        }

        if(!(item instanceof Weapon)){
            throw item.title + ' is not a weapon';
        }

        const pc = await bag.socket.getPlayer(bag.message.author.id);

        const weapon:Weapon = item as Weapon;

        const attackRows = weapon.attacks.map(function(attack){
            const attributeBonus = pc.stats[Attribute[attack.scalingAttribute]];
            const scalingBonus = CalculateScalingBonus(attributeBonus,attack.scalingLevel);
            const weightedScalingBonus = CalculateScalingBonus(attributeBonus-getHighestStatRequirement(weapon),attack.scalingLevel);
            const minDamage = attack.minBaseDamage;
            const maxDamage = attack.maxBaseDamage;
            const newScalingBonusPercent = Math.round(scalingBonus * 100);
            const weightedScalingBonusPercent = Math.round(weightedScalingBonus * 100);

            return `${attack.title} (${ScalingLevel[attack.scalingLevel]} scaling, ${minDamage} to ${maxDamage} damage)
            
    Current scaling: 
        ${DamageScaling.ByAttribute(minDamage,attributeBonus)} to ${DamageScaling.ByAttribute(maxDamage,attributeBonus)} damage (+${DamageScaling.ByAttribute(minDamage,attributeBonus)-minDamage}-${DamageScaling.ByAttribute(maxDamage,attributeBonus)-maxDamage} damage)

    New option A: 
        ${Math.round(minDamage * scalingBonus)} to ${Math.round(maxDamage * scalingBonus)} damage (${(newScalingBonusPercent-100)}% bonus)

    New option B: 
        ${Math.round(minDamage * weightedScalingBonus)} to ${Math.round(maxDamage * weightedScalingBonus)} damage (${(weightedScalingBonusPercent-100)}% bonus)`;
        })
        .join('\n\n');

        bag.message.channel.send(`${weapon.title}'s Attacks:\n\n${attackRows}`);
    }
}

function getHighestStatRequirement(weapon:Weapon):number{
    return Object.keys(weapon.useRequirements)
    .map(function(key){
        return weapon.useRequirements[key];
    })
    .reduce(function(a,b){
        return Math.max(a,b);
    });
}