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

const SHIELD_EFFECTS = [
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
            chanceToCritical: 0.1,
            criticalMultiplier: 2,
            useRequirements:{},
            attacks:[
                new WeaponAttack({
                    title: 'black magic',
                    minBaseDamage: 5,
                    maxBaseDamage: 10,
                    damageType: DamageType.dark,
                    scalingAttribute: Attribute.luck,
                    scalingLevel: ScalingLevel.No,
                    steps:[
                        new WeaponAttackStep({
                            attackMessage: '{attacker} assaults {defender} with black magic',
                            damageFunc: DefaultDamageFunc,
                        }),
                    ],
                    aiUseWeight: 0.2,
                    aiShouldIUseThisAttack: function(){return true},
                }),
                new WeaponAttack({
                    title: 'hp in half',
                    minBaseDamage: 0,
                    maxBaseDamage: 0,
                    damageType: DamageType.dark,
                    scalingAttribute: Attribute.luck,
                    scalingLevel: ScalingLevel.C,
                    steps:[
                        
                    ],
                    aiUseWeight: 0.2,
                    aiShouldIUseThisAttack: function(){return true}
                }),
                
            ],    
            showInItems: false,
        });
    }
}
