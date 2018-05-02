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
import EventTile from '../../../src/core/map/EventTile';
import { MapRedForestCastle } from "../../../src/core/map/Maps";
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('common',ItemsIndex.Vial,1);
lootGenerator.addLootItem('common',ItemsIndex.HuntingSword,0.25);
lootGenerator.addLootItem('common',ItemsIndex.WoodShield,0.25);
lootGenerator.addLootItem('common',ItemsIndex.WornLeathers,0.25);
lootGenerator.addLootItem('common',ItemsIndex.WornLeatherHelmet,0.25);
lootGenerator.addLootItem('common',ItemsIndex.PaddedHood,0.25);
lootGenerator.addLootItem('common',ItemsIndex.PaddedArmor,0.25);
lootGenerator.addLootItem('common',ItemsIndex.AmuletOfAgility,0.05);
lootGenerator.addLootItem('common',ItemsIndex.AmuletOfSpirit,0.05);
lootGenerator.addLootItem('common',ItemsIndex.AmuletOfLuck,0.05);
lootGenerator.addLootItem('common',ItemsIndex.AmuletOfStrength,0.05);
lootGenerator.addLootItem('common',ItemsIndex.AmuletOfHealth,0.05);
lootGenerator.addLootItem('common',ItemsIndex.TabletOfPoison,0.25);
//lootGenerator.addLootItem('common',ItemId.MapAfterRedForestPiece,1);

lootGenerator.addLootItem('rare',ItemsIndex.AmuletOfAgility,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.AmuletOfSpirit,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.AmuletOfLuck,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.TabletOfFire,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.AmuletOfStrength,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.AmuletOfHealth,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.RingOfFortune,0.02);
//lootGenerator.addLootItem('rare',ItemId.MapAfterRedForestPiece,0.2);

export const RedForestEvents:IMapData = {
    startX: 26,
    startY: 19,
    encounterChance: 0.3,
    encounters:[
        { id:CreatureId.FireAntMite,    weight: 0.3 },
        { id:CreatureId.FireAntWorker,  weight: 0.3 },
        { id:CreatureId.FireAntSoldier, weight: 0.1 },
    ],
    eventTiles: [
        {
            event: new EventTileForagable('Acai',ItemsIndex.Acai.id),
            coords: [
                {x:3,y:3},
                {x:3,y:4},
                {x:3,y:5},
                {x:32,y:2},
                {x:33,y:2},
            ]
        },
        {
            event: new EventTileForagable('Bane',ItemsIndex.Bane.id),
            coords: [
                {x:15,y:11},
                {x:15,y:12},
                {x:16,y:11},
                {x:16,y:12},
            ]
        },
        {
            event: new EventTileForagable('Agave',ItemsIndex.Agave.id),
            coords: [
                {x:4,y:15},
                {x:4,y:16},
                {x:4,y:17},
                {x:3,y:17},
            ]
        },
        {
            event: new EventTileForagable('Fox',ItemsIndex.Fox.id),
            coords: [
                {x:4,y:12},
                {x:5,y:12},
            ]
        },
        {
            event: new EventTileForagable('Sage',ItemsIndex.Sage.id),
            coords: [
                {x:17,y:7},
                {x:18,y:7},
            ]
        },
        {
            event: new EventTileForagable('Yerba',ItemsIndex.Yerba.id),
            coords: [
                {x:37,y:19},
                {x:38,y:19},
            ]
        },
        {
            event: new EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'common',
                    chanceToGenerate: 0.8,        
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
            event: new EventTileLootable({
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
                {x:13,y:3},
                {x:38,y:2},
            ],
        },
        {
            event: new EventTileMonster(`You've found the queen of the fire ants!`,CreatureId.FireAntQueen),
            coords: [
                {x:14,y:2},
            ],
        },
        {
            event: new EventTileMonster(`What?! This one is acting strange...`,CreatureId.FireAntInfected),
            coords: [
                {x:38,y:3},
            ],
        },
        {
            event: new EventTileDrinkableWater(),
            coords:[
                {x:26,y:8},
                {x:27,y:8},
                {x:28,y:8},
                {x:29,y:8},
                {x:30,y:8},
                {x:31,y:8},
                {x:32,y:8},
                {x:33,y:8},
                {x:34,y:8},
                {x:22,y:9},
                {x:23,y:9},
                {x:24,y:9},
                {x:25,y:9},
                {x:26,y:9},
                {x:35,y:9},
                {x:20,y:10},
                {x:21,y:10},
                {x:22,y:10},
                {x:36,y:10},
                {x:19,y:11},
                {x:36,y:11},
                {x:19,y:12},
                {x:36,y:12},
                {x:20,y:13},
                {x:21,y:13},
                {x:22,y:13},
                {x:23,y:13},
                {x:24,y:13},
                {x:25,y:13},
                {x:26,y:13},
                {x:27,y:13},
                {x:35,y:13},
                {x:27,y:14},
                {x:28,y:14},
                {x:29,y:14},
                {x:30,y:14},
                {x:31,y:14},
                {x:32,y:14},
                {x:33,y:14},
                {x:34,y:14},
            ]
        },
        {
            event: new EventTileWarp({
                mapTitle: 'RED FOREST CASTLE',
                warpOnEnter: true,
            }),
            coords:[
                { x:5, y:2 },
            ],
        },
        {
            event: new EventTileEnterMessage({
                message: `The entrance to a foreboding castle`,
                stopsPlayer: true,
            }),
            coords:[
                { x:5, y:3 },
            ],
        },
    ]
};