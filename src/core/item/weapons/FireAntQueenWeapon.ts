import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { OnAddBonusesHandler } from '../ItemEquippable';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { DefaultDamageAllFunc } from '../../damage/DefaultDamageAllFunc';

const QueenHardenEffect = new BattleTemporaryEffect({
    id: EffectId.FireAntQueenHarden,
    title: 'Fire Ant Queen Harden',
    onRemoved: function(bag){
        bag.sendBattleEmbed([`${bag.target.title}'s coccoon breaks open`]);
    },
    onAddBonuses: function(stats){
        stats.resistances.physical += 20;
        stats.resistances.fire += 20;
        stats.resistances.thunder += 20;
    }
});


const QueenPheromoneEffect = new BattleTemporaryEffect({
    id: EffectId.FireAntQueenPheromone,
    title: 'Fire Ant Queen Pheromone Spray',
    onRoundBegin: function(bag){
        const drawnBug = Math.floor(Math.random() * 3);
        let damage;

        switch(drawnBug){
            //case 0: return;
            case 1: 
                damage = Math.round(Math.random() * 10 + 5);

                bag.target.hpCurrent -= damage;

                bag.sendBattleEmbed([`- A fire ant worker is drawn to attack ${bag.target.title} (${bag.target.hpCurrent}/${bag.target.stats.hpTotal}HP) by the queen's scent! (-${damage}HP)`]);
            break;
            case 2: 
                damage = Math.round(Math.random() * 20 + 10);

                bag.target.hpCurrent -= damage;

                bag.sendBattleEmbed([`- A fire ant soldier is drawn to attack ${bag.target.title} (${bag.target.hpCurrent}/${bag.target.stats.hpTotal}HP) by the queen's scent! (-${damage}HP)`]);
            break;
        }
    }
});

export const FireAntQueenWeapon = new Weapon({
    id: ItemId.FireAntQueenWeapon,
    title: 'Fire Ant Queen Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements: {},
    goldValue: 0,
    attacks: [
        new WeaponAttack({
            title: 'protect',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: `{attacker} creates a hardened coccoon to hide in (+20 all resistances)`,
                    damageFunc: function(bag){
                        bag.battle.addTemporaryEffect(bag.attacker.creature,QueenHardenEffect,4);

                        return [];
                    }
                }),
            ],
            aiShouldIUseThisAttack: function(creature){
                return !creature.tempEffects.has(QueenHardenEffect);
            },
            aiUseWeight: 0.1
        }),
        new WeaponAttack({
            title: 'spraypheromone',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sprays {defender} with a pheromone that draws workers to attack!',
                    damageFunc: function(bag){
                        bag.battle.addTemporaryEffect(bag.defender.creature,QueenPheromoneEffect,5);

                        return [];
                    }
                }),
            ],
            aiUseWeight: 0.3
        }),
        new WeaponAttack({
            title: 'flame',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sprays fire across the area',
                    damageFunc: DefaultDamageAllFunc,
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} recovers from their attack',
                    damageFunc: function(){return [];},
                })
            ],
            aiUseWeight: 0.4
        }),
    ]
});