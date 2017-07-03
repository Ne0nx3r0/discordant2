import { ScalingLevel } from '../item/WeaponAttack';
import Creature from '../creature/Creature';
import WeaponAttack from '../item/WeaponAttack';
import Weapon from '../item/Weapon';

export const SCALING_LEVEL_MODIFIERS = {
     S: 5,
     A: 3,
     B: 2,
     C: 1,
     D: 0.5,
     No: 0,
};

export function GetScalingBonusFor(creature:Creature,attack:WeaponAttack){
    const weapon = attack.weapon;
    let highestStat = 10;//minimum
    let highestStatKey = '_none';//dummy value

    for(var key in weapon.useRequirements){
        const stat = weapon.useRequirements[key];

        if(stat > highestStat){
            highestStat = stat;
            highestStatKey = key;
        }
    }

    const adjustedStatValue = creature.stats[highestStatKey] - highestStat;

    return GetScalingBonus(adjustedStatValue,attack.scalingLevel);
}

export function GetScalingBonus(statAmount:number,scalingLevel:ScalingLevel){
    if(statAmount == 0 || scalingLevel == ScalingLevel.No){
        return 1;
    }

    const scalingModifier = SCALING_LEVEL_MODIFIERS[ ScalingLevel[scalingLevel] ];

    return 1 + scalingModifier * statAmount / 100;
}