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

export default new Weapon({
    id: ItemId.CorruptedFairiesWeapon,
    title: 'CorruptedFairies Weapon',
    description: 'A creature item',
    damageBlocked: 0.05,
    chanceToCritical: 0.2,
    useRequirements:{},
    goldValue:0,
    onAddBonuses: (e)=>{
        e.target.stats.resistances.dark += 40;
        e.target.stats.resistances.physical += 20;
    },
    attacks: [
        new WeaponAttack({
            title: 'orange',
            minBaseDamage: 10,
            maxBaseDamage: 160,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} all begin to glow BRIGHT ORANGE',
                    damageFunc: (e)=>{
                        e.battle.addTemporaryEffect(e.attacker.creature,EffectShieldGold,3);

                        return DefaultNoDamageFunc(e);
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} swirl around generating a loud humming noise',
                    damageFunc: DefaultNoDamageFunc
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} flash brightly throwing arcs of electricity everywhere',
                    damageFunc: DefaultDamageAllFunc
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'red',
            minBaseDamage: 40,
            maxBaseDamage: 60,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} all huddle up and glow BRIGHT RED',
                    damageFunc: (e)=>{
                        e.battle.addTemporaryEffect(e.attacker.creature,EffectShieldRed,3);

                        return DefaultNoDamageFunc(e);
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} let loose long whips of flame in the area',
                    damageFunc: DefaultDamageAllFunc
                }),
            ],
            aiUseWeight: 1
        }),
        new WeaponAttack({
            title: 'black',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            scalingAttribute: Attribute.agility,
            scalingLevel: ScalingLevel.No,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} all DIM as the area falls dark',
                    damageFunc: (e)=>{
                        e.battle.addTemporaryEffect(e.attacker.creature,EffectShieldBlack,3);

                        return DefaultNoDamageFunc(e);
                    },
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} begin reciting the legend of their corruption',
                    damageFunc: DefaultNoDamageFunc
                }),
                new WeaponAttackStep({
                    attackMessage: '{attacker} ',
                    damageFunc: (e)=>{
                        e.battle.participants.forEach((p)=>{
                            if(p.teamNumber !== e.attacker.teamNumber){

                            }
                        });

                        return [];
                    },
                }),
            ],
            aiUseWeight: 1
        }),
    ]
});