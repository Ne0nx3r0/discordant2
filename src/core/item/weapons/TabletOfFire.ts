import Weapon from '../Weapon';
import WeaponAttack, { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';

import Creature from '../../creature/Creature';
import {DamageScaling} from '../../damage/DamageScaling';
import ItemId from '../ItemId';
import { DamageFuncBag, DamageType } from '../WeaponAttackStep';
import { Attribute } from "../../creature/AttributeSet";
import { DefaultDamageFunc } from "../../damage/DefaultDamageFunc";
import { EffectBless } from '../../effects/types/EffectBless';

export const TabletOfFire = new Weapon({
    id: ItemId.TabletOfFire,
    title: 'Tablet of Fire',
    description: 'A stone tablet engraved with strange characters which read aloud can create a blaze of fire.',
    damageBlocked: 0.05,
    goldValue: 150,
    useRequirements:{
        spirit: 20
    },
    chanceToCritical: 0.05,
    attacks: [
        new WeaponAttack({
            title: 'flame',
            minBaseDamage: 40,
            maxBaseDamage: 60,
            specialDescription: 'Consumes all charges, damage increased by each additional charge consumed',
            damageType: DamageType.fire,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a healing legend outloudand launches a blaze of fire at {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        let fireAmount = Math.round((Math.random() * (bag.step.attack.maxBaseDamage-bag.step.attack.minBaseDamage))+bag.step.attack.minBaseDamage);

                        const extraChargesConsumed = bag.attacker.charges;

                        bag.attacker.charges = 0;

                        

                        if(bag.isCritical){
                            fireAmount = fireAmount * 2;
                        }

                        return [
                            {
                                target: bag.defender,
                                type: DamageType.fire,
                                amount: fireAmount
                            }
                        ];
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});