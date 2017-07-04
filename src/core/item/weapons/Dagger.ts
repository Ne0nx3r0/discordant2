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
import { EffectRush } from '../../effects/types/EffectRush';

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
            minBaseDamage: 6,
            maxBaseDamage: 12,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.C,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes at {defender} with a small dagger',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.6
        }),
        new WeaponAttack({
            title: 'rush',
            minBaseDamage: 10,
            maxBaseDamage: 10,
            damageType: DamageType.special,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            specialDescription: '+10 agility for 5 turns',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} channels their inner focus',
                    damageFunc: function(bag){
                        bag.battle.addTemporaryEffect(bag.attacker.creature,EffectRush,5);

                        return DefaultNoDamageFunc(bag);
                    }
                })
            ],
            aiUseWeight: 0.6
        }),
    ]
});