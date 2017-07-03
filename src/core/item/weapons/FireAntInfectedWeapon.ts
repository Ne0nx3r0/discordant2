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
import { DefeaultNoDamageFunc } from '../../damage/DefeaultNoDamageFunc';

const INFECTION_STEPS = 6;

const FireAntInfectionEffect = new BattleTemporaryEffect({
    id: EffectId.FireAntInfectionStep,
    title: 'Fire Ant Infection Step',
    onAddBonuses: function(stats,roundsLeft){
        stats.vitality -= INFECTION_STEPS - roundsLeft;
    },
    onRoundBegin: function(bag){
        const roundsLeft = bag.target.tempEffects.get(FireAntInfectionEffect);
        const vitMinus = INFECTION_STEPS - roundsLeft;

        if(vitMinus == 0){
            bag.sendBattleEmbed([`${bag.target.title} is infected with a strange infection!`]);
        }
        else if(vitMinus != 1-INFECTION_STEPS){
            bag.sendBattleEmbed([`${bag.target.title}'s infection worsens! (-${vitMinus} VIT)`]);
            bag.target.updateStats();
        }

    },
    onRemoved: function(bag){
        bag.sendBattleEmbed([`${bag.target.title} recovers from fire ant infection!`]);
    }
});

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
            aiUseWeight: 1.2
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
                    damageFunc: DefeaultNoDamageFunc,
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
                        if(!bag.defender.creature.tempEffects.has(FireAntInfectionEffect)){
                            //add infection
                            bag.battle.addTemporaryEffect(bag.defender.creature,FireAntInfectionEffect,INFECTION_STEPS);
                        }
                            
                        return [];
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} recovers from their attack',
                    damageFunc: function(){return [];},
                })
            ],
            aiUseWeight: 0.1
        }),
    ]
});