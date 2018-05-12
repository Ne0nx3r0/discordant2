import Weapon from '../Weapon';
import WeaponAttack, { WeaponDamageType, ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';

export const GiantFlyWeapon = new Weapon({
    id: ItemId.GiantFlyWeapon,
    title: 'GiantFlyWeapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    goldValue: 1,
    useRequirements: {
        strength: 0
    },
    onBattleBegin: (e)=>{
        setTimeout(() => {
            e.battle.queueBattleMessage([
                'You can fight back with `dattack` or `da`!',
            ]);
        }, 2000);
    },
    attacks: [
        new WeaponAttack({
            title: 'nip',
            minBaseDamage: 1,
            maxBaseDamage: 3,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} flings itself at {defender} smacking them in the face.',
                    damageFunc: DefaultDamageFunc
                })
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'buzz',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} buzzes annoyingly flying in random directions.',
                    damageFunc: DefaultNoDamageFunc
                })
            ],
            aiUseWeight: 1
        }),
    ]
});