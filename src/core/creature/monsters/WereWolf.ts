import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import WerewolfWeapon from '../../item/weapons/WerewolfWeapon';

export default class Werewolf extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.Werewolf,
            title: 'Werewolf',
            description: 'A doggy',
            attributes: new AttributeSet({
                strength: 50,
                agility: 10,
                vitality: 40,
                spirit: 40,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: WerewolfWeapon,
            }),
            wishesDropped: 800,
        });
    }
}