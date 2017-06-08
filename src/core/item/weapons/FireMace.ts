import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { Attribute } from "../../creature/AttributeSet";

export const FireMace = new Weapon({
    id: ItemId.FireMace,
    title: 'Fire Mace',
    description: `A mace enchanted to erupt in flame when striking an opponent`,
    damageBlocked: 0.05,
    goldValue: 250,
    useRequirements:{
        strength: 24
    },
    attacks: [
        new WeaponAttack({
            title: 'swing',
            minBaseDamage: 20,
            maxBaseDamage: 30,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.B,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} strikes {defender} with a flaming mace',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});