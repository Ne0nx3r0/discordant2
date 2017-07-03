import Weapon from '../Weapon';
import WeaponAttack, { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';
import { EffectBackstabDodge } from '../../effects/types/EffectBackstabDodge';

export const Dagger = new Weapon({
    id: ItemId.Dagger,
    title: 'Dagger',
    description: 'Among the simplest and earliest weapons ever conceived, the dagger remains a staple of both self-defense and close-quarters battle.',
    damageBlocked: 0.05,
    goldValue: 10,
    useRequirements: {
        agility: 14,
        luck: 12,
    },
    chanceToCritical: 0.1,
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 4,
            maxBaseDamage: 8,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.D,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes at {defender} with a small dagger',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.6
        }),
        new WeaponAttack({
            title: 'backstab',
            minBaseDamage: 10,
            maxBaseDamage: 25,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.luck,
            scalingLevel: ScalingLevel.A,
            specialDescription: 'Jump behind an opponent and stab at them on the following turn. (+100 dodge during 1st step)',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} jumps behind {defender}',
                    damageFunc: function(bag){
                        bag.battle.addTemporaryEffect(bag.attacker.creature,EffectBackstabDodge,1);

                        return DefaultNoDamageFunc(bag);
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} stabs {defender} at a weak spot from behind!',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.6
        }),
    ]
});