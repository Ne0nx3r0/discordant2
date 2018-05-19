import WeaponAttack, { ScalingLevel } from "../../../item/WeaponAttack";
import WeaponAttackStep, { DamageType } from "../../../item/WeaponAttackStep";
import { Attribute } from "../../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../../damage/DefaultDamageFunc";
import { PetWeaponAttack } from "../PetWeaponAttack";
import { PetAttackId } from "../PetAttackId";

export const Slash = new PetWeaponAttack({    
    id: PetAttackId.Slash,
    title: 'Slash',
    minBaseDamage: 10,
    maxBaseDamage: 20,
    damageType: DamageType.physical,
    scalingAttribute: Attribute.strength,
    scalingLevel: ScalingLevel.S,
    steps:[
        new WeaponAttackStep({
            attackMessage: '{attacker} slashes at {defender}',
            damageFunc: DefaultDamageFunc
        })
    ],
    aiUseWeight: 1,
});