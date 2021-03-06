import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import { GhostSkin } from '../../item/clothing/GhostSkin';
import { StoneDagger } from '../../item/weapons/StoneDagger';
import { GhostHoundWeapon } from '../../item/weapons/GhostHoundWeapon';

export default class GhostHound extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GhostHound,
            title: 'Ghost Hound',
            description: 'A strange spirit animal...',
            attributes: new AttributeSet({
                strength: 20,
                agility: 50,
                vitality: 18,
                spirit: 30,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                weapon: GhostHoundWeapon,
                armor: GhostSkin,
            }),
            wishesDropped: 75,
        });
    }
}