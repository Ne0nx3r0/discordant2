import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import GoblinSneakWeapon from '../../item/weapons/GoblinSneakWeapon';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';

export default class GoblinSneak extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GoblinSneak,
            title: 'Goblin Sneak',
            attackDelay: 0.5,
            description: 'A goblin master of poisons',
            attributes: new AttributeSet({
                strength: 4,
                agility: 4,
                vitality: 8,
                spirit: 12,
                luck: 0,
                charisma: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: GoblinSneakWeapon
            }),
            wishesDropped: 30,
        });
    }
}