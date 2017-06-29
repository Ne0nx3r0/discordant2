import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';

export const GiantRatWeapon = new Weapon({
    id: ItemId.GiantRatWeapon,
    title: 'Giant Rat Weapon',
    description: 'A creature item',
    damageBlocked: 0,
    useRequirements: {},
    criticalMultiplier: 2,
    chanceToCritical: 0.2,
    goldValue: 1,
    attacks: [
        new WeaponAttack({
            title: 'slash',
            minBaseDamage: 10,
            maxBaseDamage: 20,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} slashes its claws at {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 0.2
        }),
        new WeaponAttack({
            title: 'bite',
            minBaseDamage: 10,
            maxBaseDamage: 40,
            damageType: DamageType.physical,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} bites {defender}',
                    damageFunc: DefaultDamageFunc,
                }),
            ],
            aiUseWeight: 0.1
        }),
    ]
});