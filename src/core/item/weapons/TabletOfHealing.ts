import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { EffectBless } from '../../effects/types/EffectBless';

export const TabletOfHealing = new Weapon({
    id: ItemId.TabletOfHealing,
    title: 'Tablet of Healing',
    description: 'A stone tablet engraved with strange characters which read aloud can heal the reader.',
    damageBlocked: 0.05,
    goldValue: 120,
    useRequirements:{
        spirit: 16
    },
    chanceToCritical: 0.05,
    attacks: [
        new WeaponAttack({
            title: 'heal',
            minBaseDamage: 40,
            maxBaseDamage: 60,
            damageType: DamageType.healing,
            isFriendly: true,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            chargesRequired: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a healing legend outloud and heals {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        let healAmount = Math.round((Math.random() * (bag.step.attack.maxBaseDamage-bag.step.attack.minBaseDamage))+bag.step.attack.minBaseDamage);

                        const scalingAttribute = Attribute[bag.step.attack.scalingAttribute];
                        
                        healAmount = DamageScaling.ByAttribute(healAmount,bag.attacker.creature.stats[scalingAttribute]);

                        if(bag.isCritical){
                            healAmount = healAmount * 2;
                        }

                        const adjustedHealAmount = Math.min(healAmount,bag.defender.creature.stats.hpTotal-bag.defender.creature.hpCurrent);

                        return [
                            {
                                target: bag.defender,
                                type: DamageType.healing,
                                amount: adjustedHealAmount
                            }
                        ];
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'bless',
            minBaseDamage: 10,
            maxBaseDamage: 10,
            damageType: DamageType.special,
            isFriendly: true,
            chargesRequired: 1,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            specialDescription: `Adds 10 to all target resistances for 10 rounds`,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloud and blesses {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.battle.addTemporaryEffect(bag.defender.creature,EffectBless,10);

                        return [];
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});