import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import {DamageFuncBag} from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';

export default new Weapon({
    id: ItemId.GoblinSneakPoisonWeapon,
    title: 'Goblin Sneak Poison Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    attacks: [
        new WeaponAttack({
            title: 'toxicspray',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} takes in a deep breath',
                    damageFunc: function(bag:DamageFuncBag){ return {}; }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} sprays the battlefield with a powerful toxin poisoning everyone!',
                    damageFunc: function(bag){
                        bag.battle.bpcs.forEach(function(bpc){
                            bag.battle.addTemporaryEffect(bpc.pc,EffectGoblinSneakPoison,3);
                        });

                        return {};
                    }
                }),
            ],
            aiUseWeight: 0.5
        }),
        new WeaponAttack({
            title: 'dart',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} shoots a dart at {defender}',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(10,bag.attacker.stats.strength);

                        return {
                            Physical: physicalDamage * (1-bag.defender.stats.resistances.physical)
                        };
                    }
                }),
            ],
            aiUseWeight: 0.5
        })
    ]
});