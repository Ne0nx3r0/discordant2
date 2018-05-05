import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';
import { EventTileForagable } from '../../../src/core/map/tiles/EventTileForagable';
import * as ItemsIndex from '../../../src/core/item/ItemsIndex';
import EventTileLootable from "../../../src/core/map/tiles/EventTileLootable";
import EventTileMonster from "../../../src/core/map/tiles/EventTileMonster";
import EventTileWarp from "../../../src/core/map/tiles/EventTileWarp";
import LootGenerator from '../../../src/core/loot/LootGenerator';
import { EventTileDrinkableWater } from '../../../src/core/map/tiles/EventTileDrinkableWater';
import {EventTile} from '../../../src/core/map/EventTile';
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('common',ItemsIndex.Vial,1);
lootGenerator.addLootItem('rare',ItemsIndex.Tent,1);

export const LivingWoodsEvents:IMapData = {
    startX: 30,
    startY: 37,
    encounterChance: 0.1,
    encounters:[
        { id:CreatureId.WillOWisp, weight: 1 },
        { id:CreatureId.Faun, weight: 1 },
    ],
    eventTiles: [
        {
            event: new EventTileForagable('Yerba',ItemsIndex.Yerba.id),
            coords: [
                {x:3,y:2},
                {x:4,y:2},
                {x:3,y:29},
                {x:5,y:29},
                {x:5,y:31},
                {x:18,y:27},
                {x:19,y:27},
            ]
        },
        {
            event: new EventTileForagable('Acai',ItemsIndex.Acai.id),
            coords: [
                {x:13,y:3},
                {x:14,y:3},
                {x:3,y:10},
                {x:3,y:11},
                {x:4,y:11},
                {x:30,y:9},
                {x:30,y:10},
                {x:17,y:28},
                {x:18,y:28},
                {x:19,y:28},
                {x:20,y:28},
                {x:17,y:27},
                {x:20,y:27},
            ],
        },
        {
            event: new EventTileForagable('Agave',ItemsIndex.Agave.id),
            coords: [
                {x:9,y:23},
                {x:10,y:23},
                {x:11,y:23},
                {x:9,y:24},
                {x:10,y:24},
            ],
        },
        {
            event: new EventTileForagable('Sage',ItemsIndex.Sage.id),
            coords: [
                {x:21,y:36},
                {x:21,y:37},
                {x:15,y:16},
                {x:16,y:16},
                {x:17,y:16},
                {x:18,y:16},
            ],
        },
        {
            event: new EventTileForagable('Bane',ItemsIndex.Bane.id),
            coords: [
                {x:25,y:27},
                {x:25,y:28},
                {x:26,y:27},
                {x:26,y:28},
            ],
        },
        {
            event: new EventTileForagable('Fox',ItemsIndex.Fox.id),
            coords:[   
                {x:21,y:17},
                {x:21,y:18},
                {x:22,y:17},
                {x:22,y:18},
            ],
        },
        {
            event: new EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'common',
                    chanceToGenerate: 0.8,        
                },
                wishesMax: 120,
                goldMax: 200,
            }),
            coords: [
                {x:11,y:34},
                {x:29,y:27},
                {x:29,y:28},
                {x:8,y:10},
                {x:8,y:11},
                {x:28,y:6},
            ],
        },
        {
            event: new EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'rare',
                    chanceToGenerate: 0.8,        
                },
                wishesMax: 160,
                goldMax: 250,
            }),
            coords: [
                {x:15,y:19},
                {x:26,y:13},
            ],
        },
        {
            event: new EventTileEnterMessage({
                message: `A stranger hiding behind a grey robe looks you over... "Bah, come back later when you have something worth trading for!"`,
            }),
            coords: [
                {x:19,y:9},
            ],
        },
    ]
};