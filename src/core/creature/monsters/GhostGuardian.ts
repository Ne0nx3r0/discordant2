import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import { GhostSkin } from '../../item/clothing/GhostSkin';
import { StoneDagger } from '../../item/weapons/StoneDagger';

export default class GhostGuardian extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GhostGuardian,
            title: 'Ghost Guardian',
            description: 'A strange spirit...',
            attributes: new AttributeSet({
                strength: 20,
                agility: 20,
                vitality: 14,
                spirit: 30,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: StoneDagger,
                armor: GhostSkin,
            }),
            wishesDropped: 80,
        });
    }
}