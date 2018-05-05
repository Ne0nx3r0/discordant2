import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType, IWeaponAttackDamages } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultDamageAllFunc } from '../../damage/DefaultDamageAllFunc';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';
import { EffectFireAntInfection, FIRE_ANT_INFECTION_STEPS } from '../../effects/types/EffectFireAntInfection';

export const FireAntInfectedWeapon = new Weapon({
    id: ItemId.FireAntInfectedWeapon,
    title: 'Infected Fire Ant Weapon',
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
                    attackMessage: '{attacker} bites {defender} with a damaged pair of jaws',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'flamespray',
            minBaseDamage: 15,
            maxBaseDamage: 30,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sprays a giant flame at ${defender}',
                    damageFunc: DefaultDamageFunc,
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} recovers from their attack',
                    damageFunc: DefaultNoDamageFunc,
                })
            ],
            aiUseWeight: 0.4
        }),
        new WeaponAttack({
            title: 'infect',
            minBaseDamage: 1,
            maxBaseDamage: 2,
            damageType: DamageType.special,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} tramples over {defender}',
                    damageFunc: function(bag){
                        if(!bag.defender.creature.tempEffects.has(EffectFireAntInfection)){
                            //add infection
                            bag.battle.addTemporaryEffect(bag.defender.creature,EffectFireAntInfection,FIRE_ANT_INFECTION_STEPS);
                        }
                            
                        return [];
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} recovers from their attack',
                    damageFunc: function(){return [];},
                })
            ],
            aiUseWeight: 0.2
        }),
    ]
});