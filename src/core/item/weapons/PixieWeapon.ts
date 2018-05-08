import Weapon from "../Weapon";
import ItemId from "../ItemId";
import WeaponAttack, { ScalingLevel } from "../WeaponAttack";
import WeaponAttackStep, { DamageType } from "../WeaponAttackStep";
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { DefaultNoDamageFunc } from "../../damage/DefaultNoDamageFunc";

export const PixieWeapon = new Weapon({
    id: ItemId.PixieWeapon,
    title: 'Pixie Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'distracted',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: `{attacker} gets distracted examining something interesting nearby`,
                    damageFunc: DefaultNoDamageFunc,
                }),
            ],
            aiUseWeight: 0.5
        }),
        new WeaponAttack({
            title: 'heal',
            minBaseDamage: 5,
            maxBaseDamage: 10,
            isFriendly: true,
            damageType: DamageType.healing,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: `{attacker} creates a magical barrier around {defender}`,
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'zap',
            minBaseDamage: 5,
            maxBaseDamage: 10,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sends a burst of electricity at {defender}',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 1
        })
    ]
});