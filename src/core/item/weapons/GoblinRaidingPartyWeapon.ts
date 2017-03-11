import Weapon from '../../item/Weapon';
import ItemId from '../../item/ItemId';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag } from '../WeaponAttackStep';
import DamageScaling from '../../damage/DamageScaling';
import Creature from '../../creature/Creature';

export default  new Weapon({
    id: ItemId.GoblinRaidingPartyWeapon,
    title:'Goblin Raiding Party Weapons',
    description:'',
    damageBlocked: 0,
    useRequirements:{},
    attacks:[
        new WeaponAttack({
            title: 'attack',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} jumps about cutting {defender} with their axes',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(15,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.5,
        }),
        new WeaponAttack({
            title: 'heavy attack',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} gang up on {defender} for a devastating attack',
                    exhaustion: 2,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(34,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.2
        }),
        new WeaponAttack({
            title: 'regroup',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} attempts to run away and regroup',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        return {};
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} is recruiting allies!',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        return {};
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} returns with great numbers!',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        bag.attacker.attributes.Vitality += 10;
                        bag.attacker.updateStats();
                        bag.attacker.HPCurrent = bag.attacker.stats.HPTotal / 2;
                        return {};
                    }
                }),
            ],
            aiUseWeight: 1.0,
            aiShouldIUseThisAttack:function(attacker:Creature){
                //use when hp is at 20% or less
                return attacker.HPCurrent < attacker.stats.HPTotal*0.2;
            }
        }),
    ]
});
