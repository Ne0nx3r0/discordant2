import { DamageFuncBag } from '../item/WeaponAttackStep';
import IDamageSet from './IDamageSet';
import { Attribute } from "../creature/AttributeSet";
import DamageScaling from './DamageScaling';
import { WeaponDamageType } from "../item/WeaponAttack";

export function DefaultDamageFunc(bag: DamageFuncBag): IDamageSet {
    const attack = bag.step.attack;
    const weapon = attack.weapon;

    let damageAmount = Math.random() * (attack.maxBaseDamage - attack.minBaseDamage) + attack.minBaseDamage;

    if(bag.isCritical){
        damageAmount = damageAmount * weapon.criticalMultiplier; 
    }

    const scalingAttribute = Attribute[attack.scalingAttribute];

    damageAmount = DamageScaling.ByAttribute(damageAmount,bag.attacker.creature.stats[scalingAttribute]);

    const damages = {};

    damages[attack.damageType] = damageAmount;

    return damages;
}