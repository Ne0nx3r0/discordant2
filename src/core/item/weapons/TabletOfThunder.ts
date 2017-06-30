import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { EffectBless } from '../../effects/types/EffectBless';
import { EffectDodge } from '../../effects/types/EffectDodge';

export const TabletOfThunder = new Weapon({
    id: ItemId.TabletOfThunder,
    title: 'Tablet of Thunder',
    description: 'A stone tablet engraved with strange characters which read aloud can stir up ambient eletricity in the air.',
    damageBlocked: 0.05,
    goldValue: 50,
    useRequirements:{
        spirit: 16
    },
    chanceToCritical: 0.2,
    criticalMultiplier: 2,
    attacks: [
        new WeaponAttack({
            title: 'strike',
            minBaseDamage: 5,
            maxBaseDamage: 25,
            damageType: DamageType.thunder,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.C,
            chargesRequired: 1,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a healing legend outloud and heals {defender}',
                    damageFunc: DefaultDamageFunc
                }),
            ],
            aiUseWeight: 0.8
        }),/*
        new WeaponAttack({
            title: 'boost',
            minBaseDamage: 0,
            maxBaseDamage: 0,
            damageType: DamageType.special,
            isFriendly: true,
            chargesRequired: 2,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.No,
            specialDescription: `Adds 10 to dodge`,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a legend aloud and boosts the dodge of {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        bag.battle.addTemporaryEffect(bag.defender.creature,EffectDodge,10);

                        return [];
                    }
                }),
            ],
            aiUseWeight: 0.2
        }),*/
    ]
});