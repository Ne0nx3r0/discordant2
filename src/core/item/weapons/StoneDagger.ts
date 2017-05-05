import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';

export default new Weapon({
    id: ItemId.StoneDagger,
    title: 'Stone Dagger',
    description: 'A slab of solid rock carved into a vaguely dagger-like shape. Though referred to as "stone", the material seems far stronger than any typical rock. The dagger might also function as a small shield.',
    damageBlocked: 0.2,
    useRequirements:{
        Strength: 12,
    },
    goldValue: 40,
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 15,
            maxBaseDamage: 30,
            damageType: DamageType.PHYSICAL,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            chargesRequired: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashses {defender} with a stone dagger',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 1.0
        }),
    ]
});