import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';

export default class Goblin extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.Goblin,
            title: 'Goblin',
            description: 'A low level generic creature',
            attributes: new AttributeSet(10, 10, 10, 0, 0),
            equipment: new CreatureEquipment({
                weapon: BareHands
            }),
            xpDropped: 10,
        });
    }
}