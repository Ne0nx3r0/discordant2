import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { Attribute } from "../../creature/AttributeSet";

export const FireSpear = new Weapon({
    id: ItemId.FireSpear,
    title: 'Fire Spear',
    description: `A blade enchanted to erupt in flame when striking an opponent`,
    damageBlocked: 0.02,
    goldValue: 250,
    criticalMultiplier: 3,
    chanceToCritical: 0.1,
    useRequirements:{
        agility: 34
    },
    attacks: [
        new WeaponAttack({
            title: 'stab',
            minBaseDamage: 18,
            maxBaseDamage: 28,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.B,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} stabs {defender} with a flaming spear',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});