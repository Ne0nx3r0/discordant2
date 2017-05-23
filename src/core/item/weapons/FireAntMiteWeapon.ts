import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

export const FireAntMiteWeapon = new Weapon({
    id: ItemId.FireAntMiteWeapon,
    title: 'Fire Ant Mite Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'steallife',
            minBaseDamage: 5,
            maxBaseDamage: 20,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sucks the life of {defender}',
                    damageFunc: function(bag){
                        const damage = Math.round(Math.random()*(bag.step.attack.maxBaseDamage-bag.step.attack.minBaseDamage)+bag.step.attack.minBaseDamage);

                        return [
                            {
                                target: bag.defender,
                                type: DamageType.physical,
                                amount: damage
                            },
                            {
                                target: bag.attacker,
                                type: DamageType.healing,
                                amount: Math.min(5,bag.attacker.creature.stats.hpTotal-bag.attacker.creature.hpCurrent)
                            }
                        ];
                    }
                }),
            ],
            aiUseWeight: 1
        })
    ]
});