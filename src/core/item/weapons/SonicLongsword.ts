import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';

export default new Weapon({
    id: ItemId.SonicLongsword,
    title: 'Sonic Longsword',
    description: 'A blade whose hilt generates an electric charge which is inflicted on enemies',
    damageBlocked: 0.05,
    useRequirements:{
        Agility: 20
    },
    attacks: [
        new WeaponAttack({
            title: 'light',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with a sonic blade',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const thunderDamage = DamageScaling.ByAttribute(50,bag.attacker.stats.Agility);

                        return {
                            Thunder: thunderDamage * (1-bag.defender.stats.Resistances.Thunder)
                        };
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});