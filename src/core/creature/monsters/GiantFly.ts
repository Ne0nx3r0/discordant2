import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import {BareHands} from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import { GiantFlyWeapon } from '../../item/weapons/GiantFlyWeapon';

export default class Nooblet extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GiantFly,
            title: 'Giant Fly',
            description: 'A low level generic creature',
            attributes: new AttributeSet({
                strength: 4,
                agility: 4,
                vitality: 1,
                spirit: 4,
                luck: 4,
            }),
            equipment: new CreatureEquipment({
                weapon: GiantFlyWeapon
            }),
            onDefeated: (e)=>{
                e.party.sendChannelMessage(`Tip: Wishes are like XP, but you can use them for other things as well`);
            },
            wishesDropped: 5,
        });
    }
}