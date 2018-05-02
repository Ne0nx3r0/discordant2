import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import WillOWispWeapon from '../../item/weapons/WillOWispWeapon';
import { WillOWispSkin } from '../../item/clothing/WillOWispSkin';

export default class WillOWisp extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.WillOWisp,
            title: 'Will-O-Wisp',
            description: 'A dainty thingy',
            attributes: new AttributeSet({
                strength: 2,
                agility: 10,
                vitality: 20,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                armor: WillOWispSkin,
                weapon: WillOWispWeapon,
            }),
            wishesDropped: 75,
        });
    }
}