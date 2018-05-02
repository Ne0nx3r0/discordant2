import Weapon from '../Weapon';
import ItemId from '../ItemId';
import WeaponAttack from '../WeaponAttack';
import { DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';

export const FireAntMiteWeapon = new Weapon({
    id: ItemId.FireAntMiteWeapon,
    title: 'Fire Ant Mite Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'bite',
            minBaseDamage: 15,
            maxBaseDamage: 30,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} bites {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'steallife',
            minBaseDamage: 5,
            maxBaseDamage: 20,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} sucks the life of {defender}',
                    damageFunc: function(bag){
                        const damages = DefaultDamageFunc(bag);

                        damages[0].hpSteal = 5;

                        return damages;
                    }
                }),
            ],
            aiUseWeight: 1
        })
    ]
});