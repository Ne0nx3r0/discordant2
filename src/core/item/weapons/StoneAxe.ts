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
import { EffectRage } from '../../effects/types/EffectRage';

export const StoneAxe = new Weapon({
    id: ItemId.StoneAxe,
    title: 'Stone Axe',
    description: 'A large slab of solid rock carved into a vaguely axe-like shape. The "blade" is large and sturdy enough to be used as a shield.',
    damageBlocked: 0.4,
    useRequirements:{
        strength: 20,
    },
    goldValue: 30,
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes their stone axe at {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 0.9
        }),
        new WeaponAttack({
            title: 'slam',
            minBaseDamage: 50,
            maxBaseDamage: 70,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slams their axe down on {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 0.1
        }),
        new WeaponAttack({
            title: 'rage',
            specialDescription: 'Lowers VIT by 4 and increases STR by 10 (12 rounds)',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} rages letting out a terrifying scream',
                    damageFunc: function(bag: DamageFuncBag){
                        bag.battle.addTemporaryEffect(
                            bag.attacker.creature,
                            EffectRage,
                            12
                        );

                        return [];
                    },
                }),
            ],
            aiUseWeight: 0.0
        }),
    ]
});