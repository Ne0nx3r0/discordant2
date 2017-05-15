import Weapon from '../Weapon';
import WeaponAttack, { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export const Dagger = new Weapon({
    id: ItemId.Dagger,
    title: 'Dagger',
    description: 'Among the simplest and earliest weapons ever conceived, the dagger remains a staple of both self-defense and close-quarters battle.',
    damageBlocked: 0.05,
    goldValue: 10,
    useRequirements: {},
    attacks: [
        new WeaponAttack({
            title: 'stab',
            minBaseDamage: 5,
            maxBaseDamage: 10,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.D,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} stabs {defender} with a small dagger',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.6
        }),
    ]
});