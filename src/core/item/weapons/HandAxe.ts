import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';

export default new Weapon({
    id: ItemId.HandAxe,
    title: 'Hand Axe',
    description: 'A basic weapon whose history and use dates back to prehistoric times',
    damageBlocked: 0.05,
    useRequirements:{
        Strength: 10
    },
    attacks:[
        new WeaponAttack({
            title: 'light',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} swings a hand axe at {defender}',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(10,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'heavy',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} leaps at {defender} with their hand axe',
                    exhaustion: 2,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(25,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});