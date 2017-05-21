import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';
import { EventTileForagable } from '../../../src/core/map/tiles/EventTileForagable';
import ItemId from '../../../src/core/item/ItemId';
import { EventTileLootable } from "../../../src/core/map/tiles/EventTileLootable";
import { EventTileMonster } from "../../../src/core/map/tiles/EventTileMonster";
import { EventTileMap } from "../../../src/core/map/tiles/EventTileMap";
import { RedForestMapPiece } from "../../../src/core/item/ItemsIndex";
import { EventTileWarp } from "../../../src/core/map/tiles/EventTilePortal";
import LootGenerator from '../../../src/core/loot/LootGenerator';

export const lootGenerator = new LootGenerator();

export const RedForestEvents:IMapData = {
    startX: 26,
    startY: 20,
    encounterChance: 0.2,
    encounters:[
        { id:CreatureId.FireAntMite,    weight: 0.3 },
        { id:CreatureId.FireAntWorker,  weight: 0.3 },
        { id:CreatureId.FireAntSoldier, weight: 0.1 },
    ],
    eventTiles: [
        {
            event: EventTileForagable('Acai',ItemId.Acai),
            coords: [
                {x:3,y:3},
                {x:3,y:4},
                {x:3,y:5},
                {x:32,y:2},
                {x:33,y:2},
            ]
        },
        {
            event: EventTileForagable('Bane',ItemId.Bane),
            coords: [
                {x:15,y:11},
                {x:15,y:12},
                {x:16,y:11},
                {x:16,y:12},
            ]
        },
        {
            event: EventTileForagable('Fox',ItemId.Fox),
            coords: [
                {x:4,y:12},
                {x:5,y:12},
            ]
        },
        {
            event: EventTileForagable('Sage',ItemId.Sage),
            coords: [
                {x:17,y:7},
                {x:18,y:7},
            ]
        },
        {
            event: EventTileForagable('Yerba',ItemId.Yerba),
            coords: [
                {x:37,y:19},
                {x:38,y:19},
            ]
        },
        {
            event: EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'common',
                    chanceToGenerate: 0.6,        
                },
                wishesMax: 60,
                goldMax: 100,
            }),
            coords: [
                {x:3,y:10},
                {x:9,y:6},
                {x:8,y:18},
                {x:39,y:14},
                {x:28,y:2},
            ],
        },
        {
            event: EventTileLootable({
                onEnterMsg: `Items imbued with the essence of the fire ants`,
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'rare',   
                    chanceToGenerate: 1,   
                },
                wishesMax: 100,
                goldMax: 100,
            }),
            coords: [
                {x:13,y:2},
            ],
        },
        {
            event: EventTileMonster(`You've found the queen of the fire ants!`,CreatureId.GoblinChief),
            coords: [
                {x:14,y:2},
            ],
        },
        {
            event: EventTileMonster(`You've found a fire ant royal guard!`,CreatureId.GoblinChief),
            coords: [
                {x:14,y:2},
            ],
        },
    ]
};