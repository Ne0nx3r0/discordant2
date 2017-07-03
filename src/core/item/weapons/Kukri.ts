import Weapon from '../Weapon';
import WeaponAttack, { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export const Kukri = new Weapon({
    id: ItemId.Kukri,
    title: 'Kukri',
    description: '(Doubles critical chance & damage when wielding two) Inspired by the curved blades once used by elite soldiers in the Eastern armies, these simple blades are devastating when used by a skilled wielder.',
    damageBlocked: 0.01,
    criticalMultiplier: 2,
    chanceToCritical: 0.1,
    goldValue: 10,
    useRequirements: {},
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 5,
            maxBaseDamage: 11,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.A,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} their kukri',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.6
        }),
    ]
});