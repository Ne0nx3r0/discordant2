import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import { Attribute } from '../../creature/AttributeSet';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export const BareHands = new Weapon({
    id: ItemId.BareHands,
    title: 'Bare Hands',
    description: 'When you bring knuckles to a knife fight',
    damageBlocked: 0.01,
    useRequirements: {},//no use requirements
    chanceToCritical: 0.2,
    showInItems: false,
    goldValue: 0,
    attacks: [
        new WeaponAttack({
            title: 'jab',
            minBaseDamage: 2,
            maxBaseDamage: 6,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.S,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} jabs at {defender}',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'punch',           
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.S,
            minBaseDamage: 4,
            maxBaseDamage: 8,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} punches {defender}',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.1
        }),
    ]
});