import Weapon from '../Weapon';
import WeaponAttack, { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export const Mace = new Weapon({
    id: ItemId.Mace,
    title: 'Mace',
    description: 'Derivative of the club, the mace consists of a wooden shaft with a metal head at the end of it used to bash things.',
    damageBlocked: 0.05,
    goldValue: 1,
    useRequirements: {
        strength: 6
    },
    attacks: [
        new WeaponAttack({
            title: 'swing',
            minBaseDamage: 5,
            maxBaseDamage: 10,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.D,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} swings their mace at {defender}',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.6
        }),
    ]
});