import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import OldWillowWeapon from '../../item/weapons/OldWillowWeapon';

export default class OldWillow extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.OldWillow,
            title: 'Old Willow',
            description: 'A tree',
            attributes: new AttributeSet({
                strength: 40,
                agility: 4,
                vitality: 62,
                spirit: 60,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: OldWillowWeapon,
            }),
            wishesDropped: 900,
        });
    }
}