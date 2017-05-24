import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import { BareHands, HandAxe, WornLeathers, WoodShield, StoneDagger, HuntingSword } from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import PlayerParty from "../../party/PlayerParty";
import { MapWesternGate } from "../../map/Maps";
import { StoneAxe } from '../../item/weapons/StoneAxe';

export default class GoblinSoldier extends CreatureAIControlled{
    constructor(){
        super({
            id: CreatureId.GoblinChief,
            title: 'Goblin Chief',
            description: 'The highest ranked of the local tribe of goblins, often a position earned through blood and deceit.',
            allowRun: false,
            attributes: new AttributeSet({
                strength: 20,
                agility: 16,
                vitality: 20,
                spirit: 0,
                luck: 0,
            }),
            equipment: new CreatureEquipment({
                armor: WornLeathers,
                weapon: StoneAxe,
            }),
            wishesDropped: 100
        });
    }
}