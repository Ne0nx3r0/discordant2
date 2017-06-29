import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import WeaponAttackStep from '../WeaponAttackStep';
export const Spear = new Weapon({
    id: ItemId.HandAxe,
    title: 'Hand Axe',
    description: 'A simple weapon, but one whose reach and strength have made it a favorite among hunters since prehistoric times.',
    damageBlocked: 0.01,
    goldValue: 40,
    useRequirements:{
        agility: 12
    },
    attacks:[
        new WeaponAttack({
            title: 'stab',
            minBaseDamage: 10,
            maxBaseDamage: 14,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.B,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} swings a hand axe at {defender}',
                    damageFunc: DefaultDamageFunc,
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});