import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';
import { EventTileForagable } from '../../../src/core/map/tiles/EventTileForagable';
import ItemId from '../../../src/core/item/ItemId';
import { EventTileLootable } from "../../../src/core/map/tiles/EventTileLootable";
import { EventTileMonster } from "../../../src/core/map/tiles/EventTileMonster";
import { EventTileMap } from "../../../src/core/map/tiles/EventTileMap";
import { RedForestMapPiece } from "../../../src/core/item/ItemsIndex";
import { EventTileWarp } from "../../../src/core/map/tiles/EventTileWarp";
import LootGenerator from '../../../src/core/loot/LootGenerator';
import { EventTileDrinkableWater } from '../../../src/core/map/tiles/EventTileDrinkableWater';
import { MapAfterRedForestPiece } from '../../../src/core/item/maps/MapAfterRedForestPiece';
import EventTile from '../../../src/core/map/EventTile';
import { AmuletOfHealth } from '../../../src/core/item/jewelry/AmuletOfHealth';
import { MapRedForestCastle } from "../../../src/core/map/Maps";

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('common',ItemId.Vial,1);
lootGenerator.addLootItem('common',ItemId.HuntingSword,0.25);
lootGenerator.addLootItem('common',ItemId.WoodShield,0.25);
lootGenerator.addLootItem('common',ItemId.WornLeathers,0.25);
lootGenerator.addLootItem('common',ItemId.WornLeatherHelmet,0.25);
lootGenerator.addLootItem('common',ItemId.AmuletOfAgility,0.05);
lootGenerator.addLootItem('common',ItemId.AmuletOfSpirit,0.05);
lootGenerator.addLootItem('common',ItemId.AmuletOfLuck,0.05);
lootGenerator.addLootItem('common',ItemId.AmuletOfStrength,0.05);
lootGenerator.addLootItem('common',ItemId.AmuletOfHealth,0.05);
lootGenerator.addLootItem('common',ItemId.MapAfterRedForestPiece,1);

lootGenerator.addLootItem('rare',ItemId.AmuletOfAgility,0.1);
lootGenerator.addLootItem('rare',ItemId.AmuletOfSpirit,0.1);
lootGenerator.addLootItem('rare',ItemId.AmuletOfLuck,0.1);
lootGenerator.addLootItem('rare',ItemId.TabletOfFire,0.1);
lootGenerator.addLootItem('rare',ItemId.AmuletOfStrength,0.1);
lootGenerator.addLootItem('rare',ItemId.AmuletOfHealth,0.1);
lootGenerator.addLootItem('rare',ItemId.RingOfFortune,0.02);
lootGenerator.addLootItem('rare',ItemId.MapAfterRedForestPiece,0.2);

export const RedForestEvents:IMapData = {
    startX: 26,
    startY: 19,
    encounterChance: 0,
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
            event: EventTileForagable('Agave',ItemId.Agave),
            coords: [
                {x:4,y:15},
                {x:4,y:16},
                {x:4,y:17},
                {x:3,y:17},
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
                {x:13,y:3},
                {x:38,y:2},
            ],
        },
        {
            event: EventTileMonster(`You've found the queen of the fire ants!`,CreatureId.FireAntQueen),
            coords: [
                {x:14,y:2},
            ],
        },
        {
            event: EventTileMonster(`What?! This one is acting strange...`,CreatureId.FireAntInfected),
            coords: [
                {x:38,y:3},
            ],
        },
        {
            event: EventTileDrinkableWater(),
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
            event: EventTileWarp({
                mapTitle: 'RED FOREST CASTLE',
                warpOnEnter: true,
            }),
            coords:[
                { x:5, y:2 },
            ],
        },
        {
            event: new EventTile({
                onEnter: function(bag){
                    bag.party.sendCurrentMapImageFile(`The entrance to a foreboding castle`);
                }
            }),
            coords:[
                { x:5, y:3 },
            ],
        },
    ]
};