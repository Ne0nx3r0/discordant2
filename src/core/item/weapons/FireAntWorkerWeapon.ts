import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export const FireAntWorkerWeapon = new Weapon({
    id: ItemId.FireAntWorkerWeapon,
    title: 'Fire Ant Minor Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'bite',
            minBaseDamage: 8,
            maxBaseDamage: 24,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} bites {defender} with their jaws',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'flame',
            minBaseDamage: 20,
            maxBaseDamage: 40,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sprays fire at {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} recovers from their attack',
                    damageFunc: function(){return [];},
                })
            ],
            aiUseWeight: 0.4
        }),
        new WeaponAttack({
            title: 'heal',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.healing,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} recovers its health using stored nutrients',
                    damageFunc: function(bag){
                        const minDamage = bag.step.attack.minBaseDamage;
                        const maxDamage = bag.step.attack.maxBaseDamage;
                        const healAmount = Math.round(Math.random() * (maxDamage - minDamage) + minDamage);

                        return [{
                            type: DamageType.healing,
                            target: bag.attacker,
                            amount: healAmount
                        }];
                    },
                })
            ],
            aiUseWeight: 0.2
        })
    ]
});