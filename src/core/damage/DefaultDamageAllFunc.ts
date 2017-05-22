import { DamageFuncBag, IWeaponAttackDamages } from '../item/WeaponAttackStep';
import { Attribute } from "../creature/AttributeSet";
import {DamageScaling} from './DamageScaling';
import { WeaponDamageType } from "../item/WeaponAttack";

export function DefaultDamageAllFunc(bag: DamageFuncBag): Array<IWeaponAttackDamages> {
    const attack = bag.step.attack;
    const weapon = attack.weapon;

    const damages = [];

    bag.battle.participants.forEach(function(p){
        if(bag.attacker.teamNumber == p.teamNumber){
            return;
        }

        let damageAmount = Math.random() * (attack.maxBaseDamage - attack.minBaseDamage) + attack.minBaseDamage;

        if(bag.isCritical){
            damageAmount = damageAmount * weapon.criticalMultiplier; 
        }

        const scalingAttribute = Attribute[attack.scalingAttribute];

        damageAmount = DamageScaling.ByAttribute(damageAmount,bag.attacker.creature.stats[scalingAttribute]);
        
        damages.push({
            target: p,
            type: attack.damageType,
            amount: damageAmount
        });
    });

    return damages;
}