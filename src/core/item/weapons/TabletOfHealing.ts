import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";

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
            minBaseDamage: 5,
            maxBaseDamage: 10,
            damageType: DamageType.special,
            isFriendly: true,
            chargesRequired: 2,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloud blessing NOT WORKING YET {defender}',
                    damageFunc: function(bag:DamageFuncBag){

                        return [];
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});