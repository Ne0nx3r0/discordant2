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
import { DefaultDamageAllFunc } from '../../damage/DefaultDamageAllFunc';
import { EffectRegeneration } from '../../effects/types/EffectRegeneration';
import { EffectUnhittable } from '../../effects/types/EffectUnhittable';
import { EffectShieldGold } from '../../effects/types/EffectShieldGold';
import { EffectShieldRed } from '../../effects/types/EffectShieldRed';
import { EffectShieldBlack } from '../../effects/types/EffectShieldBlack';
import { EffectEnchantWeaponsDark } from '../../effects/types/EffectEnchantWeaponsDark';

export default new Weapon({
    id: ItemId.CorruptedFairiesWeapon,
    title: 'CorruptedFairies Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    chanceToCritical: 0,
    useRequirements:{},
    goldValue:0,
    onAddBonuses: (e)=>{
        e.target.stats.resistances.dark += 20;
        e.target.stats.resistances.physical += 20;
        e.target.stats.resistances.fire += 20;
    },
    attacks: [
        new WeaponAttack({
            title: 'orange',
            minBaseDamage: 20,
            maxBaseDamage: 120,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: 'The fairies begin to glow BRIGHT ORANGE',
                    damageFunc: (e)=>{
                        e.battle.addTemporaryEffect(e.attacker.creature,EffectShieldGold,3);

                        return DefaultNoDamageFunc(e);
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: 'The fairies swirl around generating a loud humming noise',
                    damageFunc: DefaultNoDamageFunc
                }),
                new WeaponAttackStep({
                    attackMessage: 'The fairies flash brightly throwing arcs of electricity everywhere',
                    damageFunc: DefaultDamageAllFunc
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'red',
            minBaseDamage: 40,
            maxBaseDamage: 70,
            damageType: DamageType.fire,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: 'The fairies huddle up and glow BRIGHT RED',
                    damageFunc: (e)=>{
                        e.battle.addTemporaryEffect(e.attacker.creature,EffectShieldRed,3);

                        return DefaultNoDamageFunc(e);
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: 'The fairies let loose long whips of flame in the area',
                    damageFunc: DefaultDamageAllFunc
                }),
            ],
            aiUseWeight: 2
        }),
        new WeaponAttack({
            title: 'black',
            minBaseDamage: 30,
            maxBaseDamage: 40,
            damageType: DamageType.special,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: 'The fairies DIM as the area falls dark',
                    damageFunc: (e)=>{
                        e.battle.addTemporaryEffect(e.attacker.creature,EffectShieldBlack,3);

                        return DefaultNoDamageFunc(e);
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: 'The fairies begin reciting the legend of their corruption',
                    damageFunc: DefaultNoDamageFunc
                }),
                new WeaponAttackStep({
                    attackMessage: 'Dark magic floods from the faires corrupting the area',
                    damageFunc: (e)=>{
                        e.battle.participants.forEach((p)=>{
                            if(p.teamNumber !== e.attacker.teamNumber && Math.random() > 0.5){
                                e.battle.addTemporaryEffect(p.creature,EffectEnchantWeaponsDark,10);
                            }
                        });

                        return DefaultDamageAllFunc(e);
                    },
                }),
            ],
            aiUseWeight: 1
        }),
    ]
});
