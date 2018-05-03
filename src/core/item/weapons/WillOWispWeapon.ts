import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep, { IWeaponAttackDamages } from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import Creature from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';
import { EffectParalyze } from '../../effects/types/EffectParalyze';

export default new Weapon({
    id: ItemId.WillOWispWeapon,
    title: 'Will-O-Wisp Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    chanceToCritical: 0.2,
    useRequirements:{},
    goldValue:0,
    attacks: [
        new WeaponAttack({
            title: 'shock',
            minBaseDamage: 1,
            maxBaseDamage: 5,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} zaps {defender} with a bolt of electricity',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 0.5
        }),
        new WeaponAttack({
            title: 'paralyze',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} flies through {defender} PARALYZING them!',
                    damageFunc: function DefaultDamageFunc(bag: DamageFuncBag): Array<IWeaponAttackDamages> {
                        bag.battle.addTemporaryEffect(bag.defender.creature,EffectParalyze,2);
                        return [];
                    },
                }),
            ],
            aiUseWeight: 0.5
        })
    ]
});