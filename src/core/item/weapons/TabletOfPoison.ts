import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import {DamageFuncBag} from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import EffectSpiritSnakePoison from '../../effects/types/EffectSpiritSnakePoison';
import { Attribute } from "../../creature/AttributeSet";

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
            minBaseDamage: 8,
            maxBaseDamage: 12,
            damageType: 'physical',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            exhaustion: 1,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloug and poisons {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.battle.addTemporaryEffect(bag.defender.creature,EffectSpiritSnakePoison,5);

                        return {};
                    }
                })
            ],
            aiUseWeight: 1.0
        })
    ]
});