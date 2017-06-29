import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import { GiantRatWeapon } from '../../item/weapons/GiantRatWeapon';

export default class Goblin extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GiantRat,
            title: 'Giant Rat',
            description: 'A low level generic creature',
            attributes: new AttributeSet({
                strength: 20,
                agility: 30,
                vitality: 20,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: GiantRatWeapon
            }),
            wishesDropped: 50,
        });
    }
}