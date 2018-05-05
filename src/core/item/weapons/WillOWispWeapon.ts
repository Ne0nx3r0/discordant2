import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep, { IWeaponAttackDamages } from '../WeaponAttackStep';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import Creature, { ICreatureStatSet } from '../../creature/Creature';

import ItemId from '../ItemId';
import EffectGoblinSneakPoison from '../../effects/types/EffectGoblinSneakPoison';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { DefaultNoDamageFunc } from '../../damage/DefaultNoDamageFunc';
import { EffectShieldRed } from '../../effects/types/EffectShieldRed';
import { DefaultDamageAllFunc } from '../../damage/DefaultDamageAllFunc';
import { EffectWillOWispDodge } from '../../effects/types/EffectWillOWispDodge';

export default new Weapon({
    id: ItemId.WillOWispWeapon,
    title: 'Will-O-Wisp Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    chanceToCritical: 0.2,
    useRequirements:{},
    goldValue:0,
    onAddBonuses: (e)=>{
        e.target.stats.resistances.dark -= 20;
        e.target.stats.resistances.thunder += 20;
    },
    onBattleBegin: (e)=>{
        e.battle.addTemporaryEffect(e.target,EffectWillOWispDodge,-1);
    },
    attacks: [
        new WeaponAttack({
            title: 'shock',
            minBaseDamage: 5,
            maxBaseDamage: 40,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} zaps {defender} with a bolt of electricity',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 0.8
        }),
        new WeaponAttack({
            title: 'shock all',
            minBaseDamage: 5,
            maxBaseDamage: 20,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} emits a wave of electricity',
                    damageFunc: DefaultDamageAllFunc
                }),
            ],
            aiUseWeight: 0.4
        }),
        new WeaponAttack({
            title: 'red shield',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            aiShouldIUseThisAttack: function(bag){
                return !bag.tempEffects.has(EffectShieldRed);  
            },
            steps: [
                new WeaponAttackStep({
                    attackMessage: `{attacker} turns bright red!`,
                    damageFunc: function DefaultDamageFunc(bag: DamageFuncBag): Array<IWeaponAttackDamages> {
                        bag.battle.addTemporaryEffect(bag.attacker.creature,EffectShieldRed,3);
                        return [];
                    },
                }),
            ],
            aiUseWeight: 0.2
        })
    ]
});