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

export const StoneAxe = new Weapon({
    id: ItemId.StoneAxe,
    title: 'Stone Axe',
    description: 'A large slab of solid rock carved into a vaguely axe-like shape. The "blade" is large and sturdy enough to be used as a shield.',
    damageBlocked: 0.4,
    useRequirements:{
        Strength: 20,
    },
    goldValue: 30,
    attacks: [
        new WeaponAttack({
            title: 'slam',
            minBaseDamage: 40,
            maxBaseDamage: 60,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.D,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slams their axe down on {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 0.9
        }),
        new WeaponAttack({
            title: 'rage',
            specialDescription: 'Lowers VIT by 4 and increases STR by 10 (12 rounds)',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.D,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} rages letting out a terrifying scream',
                    damageFunc: function(bag: DamageFuncBag){
                        bag.battle.addTemporaryEffect(
                            bag.attacker.creature,
                            new BattleTemporaryEffect({
                                id: EffectId.Rage,
                                title: 'Rage',
                                onAddBonuses: function(stats){
                                    stats.vitality -= 6;
                                    stats.strength += 10;
                                }
                            }),
                            12
                        );

                        return [];
                    },
                }),
            ],
            aiUseWeight: 0.1
        }),
    ]
});