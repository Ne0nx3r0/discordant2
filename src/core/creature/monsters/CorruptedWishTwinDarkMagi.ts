import CreatureAIControlled from '../CreatureAIControlled';
import CreatureId from '../CreatureId';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';
import Weapon from '../../item/Weapon';
import ItemId from '../../item/ItemId';
import WeaponAttack from '../../item/WeaponAttack';
import { DamageType } from '../../item/WeaponAttackStep';
import { ScalingLevel } from '../../item/WeaponAttack';
import { Attribute } from '../AttributeSet';

class CorruptedWishTwinDarkMagiWeapon extends Weapon{
    constructor(){
        super({
            id: ItemId.CorruptedWishTwinDarkMagi,
            title: 'A creature item',
            description: 'A creature item',
            goldValue: 1,
            damageBlocked: 0,
            chanceToCritical: 0,
            criticalMultiplier: 0,
            useRequirements:{},
            attacks:[
                new WeaponAttack({
                    title: 'black fire',
                    minBaseDamage: 10,
                    maxBaseDamage: 30,
                    damageType: DamageType.acid,
                    scalingAttribute: Attribute.luck,
                    scalingLevel: ScalingLevel.No,
                    steps:[

                    ],
                    aiUseWeight: 0.5,
                    aiShouldIUseThisAttack: function(){return true},
                }),
            ],    
            showInItems: false,
        });
    }
}

export default class CorruptedWishTwinDarkMagi extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.CorruptedWishTwinDarkMagi,
            title: 'Corrupted Wish: Twin Dark Magi',
            description: 'A wish made by a truly evil heart.',
            allowRun: false,
            attributes: new AttributeSet({
                strength: 10,
                agility: 10,
                vitality: 40,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: new CorruptedWishTwinDarkMagiWeapon()
            }),
            wishesDropped: 5000
        });
    }
}