import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { Attribute } from "../../creature/AttributeSet";

export const PrismBlade = new Weapon({
    id: ItemId.PrismBlade,
    title: 'Prism Blade',
    description: `A powerful weapon from a bygone era...`,
    damageBlocked: 1,
    goldValue: 1,
    useRequirements:{
        agility: 100
    },
    attacks: [
        new WeaponAttack({
            title: 'swing',
            minBaseDamage: 100,
            maxBaseDamage: 1000,
            damageType: DamageType.chaos,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.S,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with the prism blade',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});