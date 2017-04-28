import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';

const WesternGate2MapData:IMapData = {
    encounterChance: 0.2,
    encounters:[
        { 
            id: CreatureId.Goblin,
            weight: 0.6
        },
        { 
            id: CreatureId.GoblinSoldier,
            weight: 0.2
        },
        { 
            id: CreatureId.GoblinSneak,
            weight: 0.2 
        },
    ],
    eventTiles: [
        
    ]
};

export default WesternGate2MapData;