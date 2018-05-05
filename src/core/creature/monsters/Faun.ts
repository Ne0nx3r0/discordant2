import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';

export default class Faun extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.Faun,
            title: 'Faun',
            description: 'A generic creature',
            attributes: new AttributeSet({
                strength: 42,
                agility: 30,
                vitality: 20,
                spirit: 22,
                luck: 22,
            }),
            equipment: new CreatureEquipment({
                weapon: BareHands
            }),
            wishesDropped: 80,
        });
    }
}