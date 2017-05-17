import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';
import { EventTileForagable } from '../../../src/core/map/tiles/EventTileForagable';
import ItemId from '../../../src/core/item/ItemId';
import { EventTileLootable } from "../../../src/core/map/tiles/EventTileLootable";
import { EventTileMonster } from "../../../src/core/map/tiles/EventTileMonster";
import { EventTileMap } from "../../../src/core/map/tiles/EventTileMap";
import { MapNorthernSteppes } from "../../../src/core/item/ItemsIndex";
import { EventTileWarp } from "../../../src/core/map/tiles/EventTilePortal";
import LootGenerator from '../../../src/core/loot/LootGenerator';

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('rare',ItemId.RingOfAgility,0.1);
lootGenerator.addLootItem('rare',ItemId.RingOfHealth,0.1);
lootGenerator.addLootItem('rare',ItemId.RingOfStrength,0.1);
lootGenerator.addLootItem('rare',ItemId.TableOfPoison,0.1);
lootGenerator.addLootItem('rare',ItemId.Tent,0.1);

export const WesternGate2LootEvents:IMapData = {
    startX: 4,
    startY: 5,
    encounterChance: 0,
    encounters:[],
    eventTiles: [
        {
            event: EventTileLootable({
                onEnterMsg: `A selection of items the goblin hoard has stolen from travelers`,
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'rare',      
                }
            }),
            coords: [
                {x:3,y:3},
                {x:5,y:3},
            ],
        },
        {
            event: EventTileMap({
                map: MapNorthernSteppes
            }),
            coords: [
                {x:4,y:3},
            ],
        },/*
        {
            event: EventTileWarp({
                toMap: 
            }),
            coords: [
                {x:14,y:34},
            ],
        },*/
    ]
};