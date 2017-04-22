import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import {DamageFuncBag} from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import EffectSpiritSnakePoison from '../../effects/types/EffectSpiritSnakePoison';

export default new Weapon({
    id: ItemId.TableOfPoison,
    title: 'Tablet of Poison',
    description: 'A stone tablet engraved with strange characters which read aloud can poison enemies',
    damageBlocked: 0.05,
    useRequirements:{
        Spirit: 18
    },
    attacks: [
        new WeaponAttack({
            title: 'poison',
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} begins reading a legend aloud',
                    exhaustion: 1,
                    damageFunc: function(bag){
                        return {};
                    }
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} finishes reading the legend and poisons {defender}',
                    exhaustion: 1,
                    damageFunc: function(bag:DamageFuncBag){
                        bag.battle.addTemporaryEffect(bag.defender,EffectSpiritSnakePoison,5);

                        return {};
                    }
                })
            ],
            aiUseWeight: 1.0
        })
    ]
});