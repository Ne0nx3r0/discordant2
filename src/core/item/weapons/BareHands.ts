import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';
import { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import { Attribute } from '../../creature/AttributeSet';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export default new Weapon({
    id: ItemId.BareHands,
    title: 'Bare Hands',
    description: 'When you bring knuckles to a knife fight',
    damageBlocked: 0.01,
    useRequirements: {},//no use requirements
    chanceToCritical: 0.2,
    attacks: [
        new WeaponAttack({
            title: 'jab',
            minBaseDamage: 2,
            maxBaseDamage: 6,
            exhaustion: 1,
            damageType: 'physical',
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.S,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} jabs at {defender}',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'punch',
            exhaustion: 2,            
            damageType: 'physical',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.S,
            minBaseDamage: 5,
            maxBaseDamage: 10,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} punches {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        const physicalDamage = DamageScaling.ByAttribute(10,bag.attacker.creature.stats.strength*2);

                        return {
                            Physical: physicalDamage * (1-bag.defender.creature.stats.resistances.physical)
                        };
                    }
                })
            ],
            aiUseWeight: 0.2
        }),
    ]
});