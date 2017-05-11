import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import { BareHands, HandAxe, WornLeathers, WoodShield, StoneDagger, HuntingSword } from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';

export default class GoblinSoldier extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GoblinChief,
            title: 'Goblin Chief',
            description: 'The highest ranked of the local tribe of goblins, often a position earned through blood and deceit.',
            attributes: new AttributeSet({
                strength: 20,
                agility: 20,
                vitality: 20,
                spirit: 0,
                luck: 0,
                charisma: 0,
            }),
            equipment: new CreatureEquipment({
                armor: WornLeathers,
                offhand: WoodShield,
                weapon: HuntingSword,
            }),
            wishesDropped: 100,
        });
    }
}