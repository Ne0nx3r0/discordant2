import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import TreantWeapon from '../../item/weapons/TreantWeapon';

export default class Treant extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.Treant,
            title: 'Treant',
            description: 'A tree thingy',
            attributes: new AttributeSet({
                strength: 50,
                agility: 10,
                vitality: 32,
                spirit: 40,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: TreantWeapon,
            }),
            wishesDropped: 180,
        });
    }
}