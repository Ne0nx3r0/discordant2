import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import DamageScaling from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag } from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import { Attribute } from '../../creature/AttributeSet';

export default new Weapon({
    id: ItemId.HandAxe,
    title: 'Hand Axe',
    description: 'A basic weapon whose history and use dates back to prehistoric times',
    damageBlocked: 0.05,
    goldValue: 30,
    useRequirements:{
        Strength: 10
    },
    attacks:[
        new WeaponAttack({
            title: 'chop',
            minBaseDamage: 8,
            maxBaseDamage: 12,
            damageType: 'physical',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            exhaustion: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} swings a hand axe at {defender}',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'dive',
            minBaseDamage: 15,
            maxBaseDamage: 30,
            damageType: 'physical',
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            exhaustion: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} leaps at {defender} with their hand axe',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});