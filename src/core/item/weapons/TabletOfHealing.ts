import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';

export default new Weapon({
    id: ItemId.TabletOfHealing,
    title: 'Tablet of Healing',
    description: 'A stone tablet engraved with strange characters which read aloud can heal the reader.',
    damageBlocked: 0.05,
    useRequirements:{
        Spirit: 16
    },
    attacks: [
        new WeaponAttack({
            title: 'heal',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend outloud and heals 30HP',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        bag.attacker.HPCurrent = Math.min(bag.attacker.stats.HPTotal,bag.attacker.HPCurrent+30);

                        return {};
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'megaheal',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} begins reading a legend from their tablet',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        return {};
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} finishes their legend and fully heals',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        bag.attacker.HPCurrent = bag.attacker.stats.HPTotal;

                        return {};
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});