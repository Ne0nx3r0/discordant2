import CreatureAIControlled from '../CreatureAIControlled';
import CreatureId from '../CreatureId';
import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';
import Weapon from '../../item/Weapon';
import ItemId from '../../item/ItemId';
import WeaponAttack from '../../item/WeaponAttack';
import { DamageType } from '../../item/WeaponAttackStep';

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
                    title: 'attacka',
                    minBaseDamage: ,
                    maxBaseDamage: ,
                    damageType: DamageType,
                    scalingAttribute: Attribute;
                    scalingLevel: ScalingLevel;
                    chargesRequired?: number;
                    steps:Array<WeaponAttackStep>;
                    aiUseWeight: 0.1,
                    aiShouldIUseThisAttack: true,
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