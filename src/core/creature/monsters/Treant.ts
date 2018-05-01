import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import TreantWeapon from '../../item/weapons/TreantWeapon';
import { TreantSkin } from '../../item/clothing/TreantSkin';

export default class Treant extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.Treant,
            title: 'Treant',
            description: 'A tree thingy',
            attributes: new AttributeSet({
                strength: 50,
                agility: 10,
                vitality: 30,
                spirit: 40,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                armor: TreantSkin,
                weapon: TreantWeapon,
            }),
            wishesDropped: 100,
        });
    }
}