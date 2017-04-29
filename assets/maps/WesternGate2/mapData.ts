import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';
import { EventTileAcai } from '../../../src/core/map/tiles/EventTileAcai';

const WesternGate2MapData:IMapData = {
    encounterChance: 0.2,
    encounters:[
        { id:CreatureId.Goblin,        weight:0.6 },
        { id:CreatureId.GoblinSoldier, weight:0.2 },
        { id:CreatureId.GoblinSneak,   weight:0.2 },
    ],
    eventTiles: [
        {
            event: EventTileAcai,
            coords: [
                {x:20,y:24},
                {x:19,y:24},
                {x:20,y:13},
                {x:21,y:13},
                {x:4,y:3},
                {x:5,y:3},
                {x:6,y:4},
                {x:2,y:8},
                {x:2,y:9},
            ],
        }
    ]
};

export default WesternGate2MapData;