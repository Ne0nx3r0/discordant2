import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';

//TODO: Add passive resistances to shields
export default new Weapon({
    id: ItemId.WoodRoundShield,
    title: 'Wood Round Shield',
    description: 'A classic defense among foot soldiers and city guard, many of these were shattered as militia steel quelled the great beasts that took to roaming the plains.',
    damageBlocked: 0.30,
    useRequirements: {
        Strength: 10
    },
    attacks: [
        new WeaponAttack({
            title: 'shove',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} shoves {defender} with their shield',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(5,bag.attacker.stats.Strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.Resistances.Physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});