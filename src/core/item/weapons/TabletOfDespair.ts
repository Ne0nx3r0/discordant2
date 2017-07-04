/*import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import { DamageFuncBag, DamageType, IWeaponAttackDamages } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { EffectBless } from '../../effects/types/EffectBless';
import BattleTemporaryEffect from '../../effects/BattleTemporaryEffect';
import EffectId from '../../effects/EffectId';
import { EffectPrayer } from '../../effects/types/EffectPrayer';
import { GetScalingBonusFor } from '../../damage/DamageScaling';
import WeaponAttack from '../WeaponAttack';

export const TabletOfDespair = new Weapon({
    id: ItemId.TabletOfDespair,
    title: 'Tablet of Despair',
    description: 'A stone tablet engraved with strange characters which invokes feelings of doubt and pain.',
    damageBlocked: 0.05,
    goldValue: 200,
    useRequirements:{
        spirit: 30
    },
    chanceToCritical: 0.05,
    attacks: [
        new WeaponAttack({
            title: 'curse',
            minBaseDamage: 5,
            maxBaseDamage: 5,
            damageType: DamageType.healing,
            isFriendly: true,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            chargesRequired: 1,
            specialDescription: 'Heals all party members',
            steps: [
            ],
        }),
    ]
});

/* 
curse - lower opponent's VIT stat by 5
demon - summon mob whose attack is based on your missing hp
lash - 10% of your HP in damage to opponent for two turns 
*/