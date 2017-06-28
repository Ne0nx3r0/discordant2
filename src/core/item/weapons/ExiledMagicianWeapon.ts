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
import { DefaultDamageAllFunc } from '../../damage/DefaultDamageAllFunc';

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
            chanceToCritical: 0,
            criticalMultiplier: 0,
            useRequirements:{},
            attacks:[
                new WeaponAttack({
                    title: 'black magic',
                    minBaseDamage: 5,
                    maxBaseDamage: 20,
                    damageType: DamageType.dark,
                    scalingAttribute: Attribute.luck,
                    scalingLevel: ScalingLevel.No,
                    steps:[
                        new WeaponAttackStep({
                            attackMessage: '{attacker} fires a ball of dark magic at {defender}',
                            damageFunc: DefaultDamageFunc,
                        }),
                    ],
                    aiUseWeight: 0.1,
                    aiShouldIUseThisAttack: function(){return true},
                }),
                new WeaponAttack({
                    title: 'big black magic',
                    minBaseDamage: 20,
                    maxBaseDamage: 40,
                    damageType: DamageType.dark,
                    scalingAttribute: Attribute.luck,
                    scalingLevel: ScalingLevel.No,
                    steps:[
                        new WeaponAttackStep({
                            attackMessage: '{attacker} summons a mass of dark energy',
                            damageFunc: function(bag){return [];},
                        }),
                        new WeaponAttackStep({
                            attackMessage: '{attacker} emits a wave of dark magic',
                            damageFunc: DefaultDamageAllFunc,
                        }),
                    ],
                    aiUseWeight: 0.3,
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
                        new WeaponAttackStep({
                            attackMessage: '{attacker} places a dark curse on {defender} destroying HALF their HP!',
                            damageFunc: function(bag){
                                return [{
                                    type: DamageType.dark,
                                    amount: Math.ceil(bag.defender.creature.hpCurrent / 2),
                                    target: bag.defender,
                                }];
                            }
                        }),
                    ],
                    aiUseWeight: 0.1,
                    aiShouldIUseThisAttack: function(){return true}
                }),
                
            ],    
            showInItems: false,
        });
    }
}
