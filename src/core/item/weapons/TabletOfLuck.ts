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

export const TabletOfLuck = new Weapon({
    id: ItemId.TabletOfLuck,
    title: 'Tablet of Luck',
    description: 'A stone tablet engraved with strange characters which read aloud disrupts the natural flow of the area.',
    damageBlocked: 0.05,
    goldValue: 250,
    useRequirements:{
        spirit: 32
    },
    chanceToCritical: 0.05,
    attacks: [
        new WeaponAttack({
            title: 'deal',
            minBaseDamage: 1,
            maxBaseDamage: 100,
            damageType: DamageType.special,
            specialDescription: 'Causes random effect to occur',
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.A,
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