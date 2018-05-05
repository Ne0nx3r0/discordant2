import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands, TabletOfFaith, TabletOfHealing} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';

export default class PixieCreature extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.Pixie,
            title: 'Pixie',
            description: 'A helpful pixie',
            attributes: new AttributeSet({
                strength: 4,
                agility: 10,
                vitality: 12,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: TabletOfHealing,
                offhand: TabletOfFaith,
            }),
            wishesDropped: 0,
        });
    }
}