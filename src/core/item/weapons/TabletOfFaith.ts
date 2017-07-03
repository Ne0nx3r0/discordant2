import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType, IWeaponAttackDamages } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { EffectBless } from '../../effects/types/EffectBless';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import { EffectPrayer } from '../../effects/types/EffectPrayer';
import { GetScalingBonusFor } from '../../damage/DamageScaling';

export const TabletOfFaith = new Weapon({
    id: ItemId.TabletOfFaith,
    title: 'Tablet of Faith',
    description: 'A stone tablet engraved with strange characters which those who have a strong faith in themselves can use to alter the world around them.',
    damageBlocked: 0.05,
    goldValue: 200,
    useRequirements:{
        spirit: 26
    },
    chanceToCritical: 0.05,
    attacks: [
        new WeaponAttack({
            title: 'heal',
            minBaseDamage: 10,
            maxBaseDamage: 30,
            damageType: DamageType.healing,
            isFriendly: true,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            chargesRequired: 1,
            specialDescription: 'Heals all party members',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a healing legend outloud and heals the party',
                    damageFunc: function(bag:DamageFuncBag){
                        const damages:Array<IWeaponAttackDamages> = [];

                        let healAmount = Math.round((Math.random() * (bag.step.attack.maxBaseDamage-bag.step.attack.minBaseDamage))+bag.step.attack.minBaseDamage);

                        const scalingAttribute = Attribute[bag.step.attack.scalingAttribute];
                        
                        healAmount = healAmount * GetScalingBonusFor(bag.attacker.creature,this);

                        if(bag.isCritical){
                            healAmount = healAmount * 2;
                        }
                        
                        bag.battle.participants.forEach(function(p){
                            const adjustedHealAmount = Math.min(healAmount,p.creature.stats.hpTotal-p.creature.hpCurrent);

                            if(p.teamNumber == bag.attacker.teamNumber && !p.defeated){
                                damages.push({
                                    target: p,
                                    type: DamageType.healing,
                                    amount: adjustedHealAmount
                                });
                            }
                        });

                        return damages;
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'prayer',
            minBaseDamage: 15,
            maxBaseDamage: 15,
            damageType: DamageType.healing,
            isFriendly: true,
            chargesRequired: 2,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            specialDescription: `Heals party members for 5 rounds`,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloud and recites a prayer over the party',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.battle.participants.forEach(function(p){
                            if(p.teamNumber == bag.attacker.teamNumber && !p.defeated){
                                bag.battle.addTemporaryEffect(p.creature,EffectPrayer,5);
                            }
                        });

                        return [];
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
        new WeaponAttack({
            title: 'dispel',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            chargesRequired: 2,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            specialDescription: `Removes any temporary effects from the target`,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} dispels all effects from {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.defender.creature.tempEffects.forEach(function(roundsLeft,effect){
                            bag.battle.removeTemporaryEffect(bag.defender.creature,effect);
                        });

                        return [];
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});