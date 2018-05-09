import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType, IWeaponAttackDamages } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';

export const FireAntSoldierWeapon = new Weapon({
    id: ItemId.FireAntSoldierWeapon,
    title: 'Fire Ant Major Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'bite',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} bites {defender} with their massive jaws',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 1.2
        }),
        new WeaponAttack({
            title: 'flame',
            minBaseDamage: 15,
            maxBaseDamage: 30,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sprays fire at {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} recovers from their attack',
                    damageFunc: DefaultNoDamageFunc,
                })
            ],
            aiUseWeight: 0.6
        }),
    ]
});