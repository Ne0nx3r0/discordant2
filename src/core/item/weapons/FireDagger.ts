import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { Attribute } from "../../creature/AttributeSet";

export const FireDagger = new Weapon({
    id: ItemId.FireDagger,
    title: 'Fire Dagger',
    description: `A blade enchanted to erupt in flame when striking an opponent`,
    damageBlocked: 0.05,
    goldValue: 200,
    useRequirements:{
        agility: 16
    },
    attacks: [
        new WeaponAttack({
            title: 'swing',
            minBaseDamage: 8,
            maxBaseDamage: 16,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.B,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with a flaming blade',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});