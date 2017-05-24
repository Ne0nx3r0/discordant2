import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import { BareHands, HandAxe, WornLeathers, WoodShield, StoneDagger } from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';

export default class GoblinSoldier extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GoblinSoldier,
            title: 'Goblin Soldier',
            description: 'A trained goblin, normally serves as a scout or a member of raiding parties',
            attributes: new AttributeSet({
                strength: 8,
                agility: 12,
                vitality: 6,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                armor: WornLeathers,
                offhand: WoodShield,
                weapon: HandAxe,
            }),
            wishesDropped: 30,
        });
    }
}