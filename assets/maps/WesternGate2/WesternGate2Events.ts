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

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('common',ItemId.HuntingSword,0.1);
lootGenerator.addLootItem('common',ItemId.WoodShield,0.3);
lootGenerator.addLootItem('common',ItemId.HandAxe,0.1);
lootGenerator.addLootItem('common',ItemId.WornLeathers,0.3);
lootGenerator.addLootItem('common',ItemId.WornLeatherHelmet,0.3);
lootGenerator.addLootItem('common',ItemId.ClothTunic,0.3);
lootGenerator.addLootItem('common',ItemId.ClothHood,0.3);
lootGenerator.addLootItem('common',ItemId.Vial,1);
lootGenerator.addLootItem('common',ItemId.RedForestMapPiece,0.3);

lootGenerator.addLootItem('rare',ItemId.RingOfAgility,0.1);
lootGenerator.addLootItem('rare',ItemId.RingOfHealth,0.1);
lootGenerator.addLootItem('rare',ItemId.RingOfStrength,0.1);
lootGenerator.addLootItem('rare',ItemId.RingOfLuck,0.1);
lootGenerator.addLootItem('rare',ItemId.RingOfSpirit,0.1);
lootGenerator.addLootItem('rare',ItemId.TableOfPoison,0.1);
lootGenerator.addLootItem('rare',ItemId.Tent,0.1);
lootGenerator.addLootItem('rare',ItemId.RedForestMapPiece,0.4);

export const WesternGate2Events:IMapData = {
    startX: 25,
    startY: 22,
    encounterChance: 0.2,
    encounters:[
        { id:CreatureId.Goblin,        weight:0.4 },
        { id:CreatureId.GoblinSoldier, weight:0.1 },
        { id:CreatureId.GoblinSneak,   weight:0.1 },
    ],
    eventTiles: [
        {
            event: EventTileForagable('Acai',ItemId.Acai),
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
            ]
        },
        {
            event: EventTileForagable('Bane',ItemId.Bane),
            coords: [
                {x:12,y:4},
                {x:12,y:5},
                {x:13,y:4},
                {x:13,y:5},
                {x:3,y:23},
                {x:4,y:23},
                {x:3,y:24},
                {x:4,y:24},
            ]
        },
        {
            event: EventTileForagable('Fox',ItemId.Fox),
            coords: [
                {x:8,y:17},
                {x:9,y:17},
                {x:18,y:18},
                {x:18,y:19},
            ]
        },
        {
            event: EventTileForagable('Sage',ItemId.Sage),
            coords: [
                {x:10,y:21},
                {x:11,y:21},
                {x:24,y:3},
                {x:24,y:4},
            ]
        },
        {
            event: EventTileForagable('Yerba',ItemId.Yerba),
            coords: [
                {x:7,y:9},
                {x:8,y:9},
                {x:7,y:10},
                {x:8,y:10},
            ]
        },
        {
            event: EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'common',
                    chanceToGenerate: 0.6,        
                },
                wishesMax: 40,
                goldMax: 50,
            }),
            coords: [
                {x:9,y:2},
                {x:19,y:2},
                {x:14,y:9},
                {x:14,y:12},
                {x:2,y:18},
                {x:12,y:24},
                {x:25,y:18},
            ],
        },
        {
            event: EventTileMonster(`You've found the leader of the goblins!`,CreatureId.GoblinChief),
            coords: [
                {x:3,y:11},
            ],
        },
        {
            event: EventTileLootable({
                onEnterMsg: `A selection of items the goblin hoard has stolen from travelers`,
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'rare',   
                    chanceToGenerate: 1,   
                },
                wishesMax: 100,
                goldMax: 100,
            }),
            coords: [
                {x:3,y:12},
                {x:26,y:7},
            ],
        },
        {
            event: EventTileWarp({}),
            coords: [
                {x:3,y:13},
            ],
        },
    ]
};