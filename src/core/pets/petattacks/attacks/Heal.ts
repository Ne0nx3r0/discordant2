import WeaponAttack, { ScalingLevel } from "../../../item/WeaponAttack";
import WeaponAttackStep, { DamageType } from "../../../item/WeaponAttackStep";
import { Attribute } from "../../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../../damage/DefaultDamageFunc";
import { PetWeaponAttack } from "../PetWeaponAttack";
import { PetAttackId } from "../PetAttackId";

export const Heal = new PetWeaponAttack({
    id: PetAttackId.Heal,    
    title: 'Heal',
    minBaseDamage: 5,
    maxBaseDamage: 20,
    damageType: DamageType.healing,
    scalingAttribute: Attribute.spirit,
    scalingLevel: ScalingLevel.S,
    steps: [
        new WeaponAttackStep({
            attackMessage: '{attacker} heals {defender}',
            damageFunc: DefaultDamageFunc
        })
    ],
    aiUseWeight: 1,
    isFriendly: true,
});