import Weapon from '../Weapon';
import WeaponAttack, { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';

export const GiantWaspWeapon = new Weapon({
    id: ItemId.GiantWaspWeapon,
    title: 'GiantWaspWeapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    goldValue: 1,
    useRequirements: {
        strength: 0
    },
    onBattleBegin: (e)=>{

    },
    attacks: [
        new WeaponAttack({
            title: 'bite',
            minBaseDamage: 1,
            maxBaseDamage: 4,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} bites at {defender}',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'sting',
            minBaseDamage: 5,
            maxBaseDamage: 10,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} stings {defender}, it hurts so much!!',
                    damageFunc: DefaultNoDamageFunc
                })
            ],
            aiUseWeight: 0.5
        }),
    ]
});