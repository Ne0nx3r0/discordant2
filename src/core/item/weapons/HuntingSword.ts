import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';

export default new Weapon({
    id: ItemId.HuntingSword,
    title: 'Hunting Sword',
    description: 'A straight, pointed blade used to quickly and silently finish off prey before its calls can alert other, larger predators to the meal.',
    damageBlocked: 0.05,
    useRequirements: {
        Strength: 12
    },//no use requirements
    attacks: [
        new WeaponAttack({
            title: 'light',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slices {defender} with their hunting sword',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(12,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.5
        }),
        new WeaponAttack({
            title: 'duo',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} jumps behind and slashes {defender} with their hunting sword',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(12,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} follows up with a stab to {defender}',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(10,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.5
        }),
    ]
});