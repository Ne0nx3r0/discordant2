import { DamageFuncBag, IWeaponAttackDamages } from '../item/WeaponAttackStep';
import { Attribute } from "../creature/AttributeSet";
import { WeaponDamageType } from "../item/WeaponAttack";
import { GetScalingBonus, GetScalingBonusFor } from './DamageScaling';

export function DefaultDamageFunc(bag: DamageFuncBag): Array<IWeaponAttackDamages> {
    const attack = bag.step.attack;
    const weapon = attack.weapon;

    let damageAmount = Math.random() * (attack.maxBaseDamage - attack.minBaseDamage) + attack.minBaseDamage;

    if(bag.isCritical){
        damageAmount = damageAmount * weapon.criticalMultiplier; 
    }

    const scalingAttribute = Attribute[attack.scalingAttribute];

    damageAmount = damageAmount * GetScalingBonusFor(bag.attacker.creature,attack);
    
    return [{
        target: bag.defender,
        type: attack.damageType,
        amount: damageAmount
    }];
}