import AllItems from '../src/core/item/AllItems';
import Weapon from '../src/core/item/Weapon';
import CalculateDamagePerRound from '../src/util/CalculateDamagePerRound';
import { DamageType } from '../src/core/item/WeaponAttackStep';
import { SCALING_LEVEL_MODIFIERS } from '../src/core/damage/DamageScaling';
import { Attribute } from '../src/core/creature/AttributeSet';
import { ScalingLevel } from '../src/core/item/WeaponAttack';

const items = new AllItems();

console.log("Weapon	Attack	Min Damage	Max Damage	Charges Needed	Damage Type	Friendly	Scaling Level	Scaling Stat	Scaling Attibute	Critical Multiplier	Crit %	DPR	Stat Required");

items.items.forEach(function(item){
    if(item instanceof Weapon){
        const weapon = item;

        item.attacks.forEach(function(attack){
            const dpr = CalculateDamagePerRound(attack);

            let statsRequired  = 0; 

            try{
                statsRequired = Object
                .keys(weapon.useRequirements)
                .map(function(key){
                    return weapon.useRequirements[key];
                })
                .reduce(function(a,b){
                    return a + b;
                });
            }
            catch(ex){}

                console.log(`${weapon.title}	${attack.title}	${attack.minBaseDamage}	${attack.maxBaseDamage}	${attack.chargesRequired}	${DamageType[attack.damageType]}	${attack.isFriendly}	${ScalingLevel[attack.scalingLevel]}	${attack.weapon.useRequirements[Attribute[attack.scalingAttribute]]}	${Attribute[attack.scalingAttribute]}	${attack.weapon.criticalMultiplier}	${attack.weapon.chanceToCritical}	${dpr}	${statsRequired}`);
        });
    }    
});