import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';

export default new Weapon({
    id: ItemId.BareHands,
    title: 'Bare Hands',
    description: 'When you bring knuckles to a knife fight',
    damageBlocked: 0.02,
    useRequirements: {},//no use requirements
    attacks: [
        new WeaponAttack({
            title: 'light',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} swings a fist at {defender}',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(5,bag.attacker.stats.Agility*2);

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
                    attackMessage: '{attacker} swings both fists at {defender}',
                    exhaustion: 2,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(10,bag.attacker.stats.Strength*2);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.2
        }),
    ]
});