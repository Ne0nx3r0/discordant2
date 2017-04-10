import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import { BareHands, HandAxe, WornLeathers, WoodRoundShield } from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';

export default class GoblinSoldier extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GoblinSoldier,
            title: 'Goblin Soldier',
            description: 'A trained goblin, normally serves as a scout or a member of raiding parties',
            attributes: new AttributeSet({
                strength: 14,
                agility: 14,
                vitality: 12,
                spirit: 0,
                luck: 0,
                charisma: 0,
            }),
            equipment: new CreatureEquipment({
                armor: WornLeathers,
                offhand: WoodRoundShield,
                weapon: HandAxe,
            }),
            xpDropped: 20,
        });
    }
}