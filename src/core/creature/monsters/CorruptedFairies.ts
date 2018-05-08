import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import CorruptedFairiesWeapon from '../../item/weapons/CorruptedFairiesWeapon';

export default class CorruptedFairies extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.CorruptedFairies,
            title: 'Corrupted Fairies',
            description: 'Some fairies',
            attributes: new AttributeSet({
                strength: 10,
                agility: 50,
                vitality: 80,
                spirit: 40,
                luck: 50,
            }),
            equipment: new CreatureEquipment({
                weapon: CorruptedFairiesWeapon,
            }),
            wishesDropped: 1200,
        });
    }
}