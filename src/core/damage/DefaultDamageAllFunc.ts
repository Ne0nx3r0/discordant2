import { DamageFuncBag, IWeaponAttackDamages } from '../item/WeaponAttackStep';
import { Attribute } from "../creature/AttributeSet";
import { WeaponDamageType } from "../item/WeaponAttack";
import { GetScalingBonusFor } from './DamageScaling';

export function DefaultDamageAllFunc(e): Array<IWeaponAttackDamages> {
    const attack = e.step.attack;
    const weapon = attack.weapon;

    const damages = [];

    e.battle.participants.forEach(function(p){
        if(e.attacker.teamNumber == p.teamNumber
        || e.attacker.defeated){
            return;
        }

        let damageAmount = Math.random() * (attack.maxBaseDamage - attack.minBaseDamage) + attack.minBaseDamage;

        if(e.isCritical){
            damageAmount = damageAmount * weapon.criticalMultiplier; 
        }

        const scalingAttribute = Attribute[attack.scalingAttribute];

        damageAmount = damageAmount * GetScalingBonusFor(e.attacker.creature,attack);
        
        damages.push({
            target: p,
            type: attack.damageType,
            amount: Math.round(damageAmount)
        });
    });

    return damages;
}