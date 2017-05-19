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
         //   specialDescription: 'Consumes up to 10 charges, damage increases by each additional charge consumed',
            damageType: DamageType.fire,
            scalingAttribute: Attribute.spirit,
            scalingLevel: ScalingLevel.B,
            chargesRequired: 2,
            steps: [
                new WeaponAttackStep({
                    attackMessage: '{attacker} reads a healing legend outloudand launches a blaze of fire at {defender}',
                    damageFunc: function(bag:DamageFuncBag){
                        let fireAmount = (Math.random() * (bag.step.attack.maxBaseDamage-bag.step.attack.minBaseDamage))+bag.step.attack.minBaseDamage;
/*
                        const extraChargesConsumed = bag.attacker.charges;

                        bag.attacker.charges = 0;

                        const baseModifier = extraChargesConsumed * 0.1;
                        const totalModifier = baseModifier * extraChargesConsumed;

                        switch(extraChargesConsumed){
                            case 0:
                        
                            break;
                            case 1:
                                fireAmount = fireAmount * 2.2;
                            break;
                            case 2:
                                fireAmount = fireAmount * 3.6;
                            break;
                            case 3:
                                fireAmount = fireAmount * 5.2;
                            break;
                            case 4:
                                fireAmount = fireAmount * 6.4;
                            break;
                            case 5: 
                                fireAmount = fireAmount * 8;
                            break;
                            case 6: 
                                fireAmount = fireAmount * 10;
                            break;
                            case 7: 
                                fireAmount = fireAmount * 12;
                            break;
                            default: //8+
                                fireAmount = fireAmount * 14;

                                //give some back since we max at 8 (+2 taken already)
                                if(extraChargesConsumed > 8){
                                    bag.attacker.charges = extraChargesConsumed - 8;
                                }
                        }*/

                        if(bag.isCritical){
                            fireAmount = fireAmount * 2;
                        }

                        return [
                            {
                                target: bag.defender,
                                type: DamageType.fire,
                                amount: Math.round(fireAmount)
                            }
                        ];
                    }
                })
            ],
            aiUseWeight: 0.8
        }),
    ]
});