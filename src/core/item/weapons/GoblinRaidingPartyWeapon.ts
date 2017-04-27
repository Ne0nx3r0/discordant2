import Weapon from '../../item/Weapon';
import ItemId from '../../item/ItemId';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag } from '../WeaponAttackStep';
import DamageScaling from '../../damage/DamageScaling';
import Creature from '../../creature/Creature';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { Attribute } from "../../creature/AttributeSet";

export default  new Weapon({
    id: ItemId.GoblinRaidingPartyWeapon,
    title:'Goblin Raiding Party Weapons',
    description:'',
    damageBlocked: 0,
    useRequirements:{},
    attacks:[
        new WeaponAttack({
            title: 'attack',
            minBaseDamage: 10,
            maxBaseDamage: 15,
            damageType: 'physical',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            exhaustion: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} jumps about cutting {defender} with their axes',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.5,
        }),
        new WeaponAttack({
            title: 'heavy attack',
            minBaseDamage: 25,
            maxBaseDamage: 35,
            damageType: 'physical',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            exhaustion: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} gang up on {defender} for a devastating attack',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.2
        }),
        new WeaponAttack({
            title: 'regroup',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: 'special',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            exhaustion: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} attempts to run away and regroup',
                    damageFunc: function(bag:DamageFuncBag){
                        return {};
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} is recruiting allies!',
                    damageFunc: function(bag:DamageFuncBag){
                        return {};
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} returns with great numbers!',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.attacker.creature.attributes.vitality += 10;
                        bag.attacker.creature.updateStats();
                        bag.attacker.creature.hpCurrent = bag.attacker.creature.stats.hpTotal / 2;
                        return {};
                    }
                }),
            ],
            aiUseWeight: 1.0,
            aiShouldIUseThisAttack:function(attacker:Creature){
                //use when hp is at 50% or less
                return attacker.hpCurrent < 50;
            }
        }),
    ]
});
