import ItemId from '../ItemId';
import Weapon from '../Weapon';
import WeaponAttack from '../WeaponAttack';
import { DamageType } from '../WeaponAttackStep';
import { Attribute } from '../../creature/AttributeSet';
import { ScalingLevel } from '../WeaponAttack';
import WeaponAttackStep from '../WeaponAttackStep';
import { DefaultDamageFunc } from '../../damage/DefaultDamageFunc';
import { EffectShieldGrey } from '../../effects/types/EffectShieldGrey';
import { EffectShieldGold } from '../../effects/types/EffectShieldGold';
import { EffectShieldRed } from '../../effects/types/EffectShieldRed';

const shieldEffects = [
    EffectShieldGrey,
    EffectShieldGold,
    EffectShieldRed,
];

export class ExiledMagicianWeapon extends Weapon{
    constructor(){
        super({
            id: ItemId.ExiledMagician,
            title: 'Exiled Magician',
            description: 'Hrm.',
            goldValue: 1,
            damageBlocked: 0,
            chanceToCritical: 0,
            criticalMultiplier: 0,
            useRequirements:{},
            attacks:[
                new WeaponAttack({
                    title: 'black magic',
                    minBaseDamage: 10,
                    maxBaseDamage: 30,
                    damageType: DamageType.dark,
                    scalingAttribute: Attribute.luck,
                    scalingLevel: ScalingLevel.No,
                    steps:[
                        new WeaponAttackStep({
                            attackMessage: '{attacker} assaults {defender} with black magic',
                            damageFunc: DefaultDamageFunc,
                        }),
                    ],
                    aiUseWeight: 0.4,
                    aiShouldIUseThisAttack: function(){return true},
                }),
                new WeaponAttack({
                    title: 'resistance swap fire',
                    minBaseDamage: 0,
                    maxBaseDamage: 0,
                    damageType: DamageType.dark,
                    scalingAttribute: Attribute.luck,
                    scalingLevel: ScalingLevel.C,
                    steps: [
                        new WeaponAttackStep({
                            attackMessage: '{attacker} creates a magic shield!',
                            damageFunc: function(bag){


                                return [];
                            }
                        }),
                    ],
                    aiUseWeight: 0.3,
                    aiShouldIUseThisAttack: function(){return true},
                }),
            ],    
            showInItems: false,
        });
    }
}
