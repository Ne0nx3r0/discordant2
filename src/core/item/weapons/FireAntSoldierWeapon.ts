import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType, IWeaponAttackDamages } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export const FireAntSoldierWeapon = new Weapon({
    id: ItemId.FireAntSoldierWeapon,
    title: 'Fire Ant Major Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'bite',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} bites {defender} with their massive jaws',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 1.2
        }),
        new WeaponAttack({
            title: 'flame',
            minBaseDamage: 15,
            maxBaseDamage: 30,
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
            aiUseWeight: 0.6
        }),
        new WeaponAttack({
            title: 'explode',
            minBaseDamage: 80,
            maxBaseDamage: 100,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} wraps its arms around itself and begins flexing',
                    damageFunc: function(){return[];},
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} flexes its stomach muscles together tightly',
                    damageFunc: function(){return[];},
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} explodes spraying a firey liquid everywhere',
                    damageFunc: function(bag){
                        const damages:Array<IWeaponAttackDamages> = [];
                        const minDamage = bag.step.attack.minBaseDamage;
                        const maxDamage = bag.step.attack.maxBaseDamage;

                        bag.battle.participants.forEach(function(p){
                            if(p.teamNumber != bag.attacker.teamNumber){
                                const damageAmount = Math.round(Math.random() * (maxDamage - minDamage) + minDamage);

                                damages.push({
                                    type: DamageType.fire,
                                    amount: damageAmount,
                                    target: p,
                                });
                            }
                        });

                        return damages.concat({
                            type: DamageType.physical,
                            amount: bag.attacker.creature.hpCurrent * 2,
                            target: bag.attacker,
                        });
                    },
                })
            ],
            aiUseWeight: 0.1
        })
    ]
});