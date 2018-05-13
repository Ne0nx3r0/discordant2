import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import { Attribute } from '../../creature/AttributeSet';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';

export const FaunWeapon = new Weapon({
    id: ItemId.FaunWeapon,
    title: 'FaunWeapon',
    description: 'Kind of a faun weapon',
    damageBlocked: 0.01,
    useRequirements: {},
    chanceToCritical: 0.2,
    showInItems: false,
    goldValue: 0,
    onAddBonuses: function(e){
        e.target.stats.resistances.dark += 30;
    },
    attacks: [
        new WeaponAttack({
            title: 'scratch',
            minBaseDamage: 15,
            maxBaseDamage: 30,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: `{attacker} swings at {defender} with its paw`,
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'ram',
            minBaseDamage: 40,
            maxBaseDamage: 80,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} rears its head back and kicks up dirt',
                    damageFunc: DefaultNoDamageFunc,
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} rams {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'heal up',           
            damageType: DamageType.healing,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            minBaseDamage: 5,
            maxBaseDamage: 50,
            aiShouldIUseThisAttack: function(bag){
                return bag.hpCurrent < bag.stats.hpTotal * 0.2;
            },
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} calls on the forest to heal it',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 0.5
        }),
    ],
});
