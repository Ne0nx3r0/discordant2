import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel, WeaponDamageType } from '../WeaponAttack';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

//TODO: Add passive resistances to shields
export const WoodShield = new Weapon({
    id: ItemId.WoodShield,
    title: 'Wood Shield',
    description: 'A classic defense among foot soldiers and city guard, many of these were shattered as militia steel quelled the great beasts that took to roaming the plains.',
    damageBlocked: 0.30,
    goldValue: 50,
    useRequirements: {
        strength: 10
    },
    attacks: [
        new WeaponAttack({
            title: 'shove',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.B,
            minBaseDamage: 2,
            maxBaseDamage: 5,
            damageType: DamageType.physical,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} shoves {defender} with their shield',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});