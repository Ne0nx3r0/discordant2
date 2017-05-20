import Creature from '../Creature';
import CreatureId from '../CreatureId';
import CreatureEquipment from '../../item/CreatureEquipment';
import { BareHands, HandAxe, WornLeathers, WoodShield, StoneDagger, HuntingSword } from '../../item/ItemsIndex';
import AttributeSet from '../AttributeSet';
import CreatureAIControlled from '../CreatureAIControlled';
import PlayerParty from "../../party/PlayerParty";
import { WesternGate2Map, WesternGate2LootMap } from "../../map/Maps";
import { StoneAxe } from '../../item/weapons/StoneAxe';

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
            }),
            equipment: new CreatureEquipment({
                armor: WornLeathers,
                weapon: StoneAxe,
            }),
            wishesDropped: 100,
            onDefeated: function(bag){
                bag.party.sendChannelMessage(`After defeating the chief you discover a trap door leading to the chief's lair`); 

                bag.party.explore(WesternGate2LootMap);
            }
        });
    }
}