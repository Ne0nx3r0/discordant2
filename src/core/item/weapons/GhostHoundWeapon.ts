import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';

import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';

export const GhostHoundWeapon = new Weapon({
    id: ItemId.GhostHoundWeapon,
    title: 'Ghost Hound Weapon',
    description: 'A creature item',
    damageBlocked: 0,
    useRequirements: {},
    goldValue: 1,
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes {defender} with ghostly claws',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'bite',
            minBaseDamage: 20,
            maxBaseDamage: 40,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.strength,
            scalingLevel: ScalingLevel.C,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} bites {defender} with its massive ghostly jaws',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 0.2
        }),
    ]
});