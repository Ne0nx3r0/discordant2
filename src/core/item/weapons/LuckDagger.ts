import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';

export const LuckyDagger = new Weapon({
    id: ItemId.LuckyDagger,
    title: 'Lucky Dagger',
    description: 'A dagger with a curious enchantment which guides the feelings of its wielder to find the right moment to strike.',
    damageBlocked: 0.01,
    useRequirements:{
        agility: 20,
        luck: 20,
    },
    criticalMultiplier: 5,
    chanceToCritical: 0.3,
    goldValue: 100,
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 7,
            maxBaseDamage: 13,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.luck,
            scalingLevel: ScalingLevel.S,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with their lucky blade',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 1.0
        }),
    ]
});