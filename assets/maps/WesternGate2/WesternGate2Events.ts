import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';
import { EventTileForagable } from '../../../src/core/map/tiles/EventTileForagable';
import * as ItemsIndex from '../../../src/core/item/ItemsIndex';
import EventTileLootable from "../../../src/core/map/tiles/EventTileLootable";
import EventTileMonster from "../../../src/core/map/tiles/EventTileMonster";
import { RedForestMapPiece } from "../../../src/core/item/ItemsIndex";
import EventTileWarp from "../../../src/core/map/tiles/EventTileWarp";
import LootGenerator from '../../../src/core/loot/LootGenerator';
import { Spear } from '../../../src/core/item/weapons/Spear';

const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('common',ItemsIndex.HuntingSword,0.1);
lootGenerator.addLootItem('common',ItemsIndex.WoodShield,0.3);
lootGenerator.addLootItem('common',ItemsIndex.HandAxe,0.3);
lootGenerator.addLootItem('common',ItemsIndex.Spear,0.3);
lootGenerator.addLootItem('common',ItemsIndex.WornLeathers,0.3);
lootGenerator.addLootItem('common',ItemsIndex.WornLeatherHelmet,0.3);
lootGenerator.addLootItem('common',ItemsIndex.ClothTunic,0.3);
lootGenerator.addLootItem('common',ItemsIndex.ClothHood,0.3);
lootGenerator.addLootItem('common',ItemsIndex.Dagger,0.3);
lootGenerator.addLootItem('common',ItemsIndex.Vial,1);

lootGenerator.addLootItem('rare',ItemsIndex.RingOfAgility,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.RingOfHealth,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.RingOfStrength,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.RingOfLuck,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.RingOfSpirit,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.TabletOfPoison,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.Tent,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.PaddedHood,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.PaddedArmor,0.1);

export const WesternGate2Events:IMapData = {
    startX: 25,
    startY: 22,
    encounterChance: 0.15,
    pets: [],
    encounters:[
        { id:CreatureId.Goblin,        weight:0.4 },
        { id:CreatureId.GoblinSoldier, weight:0.1 },
    ],
    eventTiles: [
        {
            event: new EventTileForagable('Acai',ItemsIndex.Acai.id),
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
            event: new EventTileForagable('Bane',ItemsIndex.Bane.id),
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
            event: new EventTileForagable('Fox',ItemsIndex.Fox.id),
            coords: [
                {x:8,y:17},
                {x:9,y:17},
                {x:18,y:18},
                {x:18,y:19},
            ]
        },
        {
            event: new EventTileForagable('Sage',ItemsIndex.Sage.id),
            coords: [
                {x:10,y:21},
                {x:11,y:21},
                {x:24,y:3},
                {x:24,y:4},
            ]
        },
        {
            event: new EventTileForagable('Yerba',ItemsIndex.Yerba.id),
            coords: [
                {x:7,y:9},
                {x:8,y:9},
                {x:7,y:10},
                {x:8,y:10},
            ]
        },
        {
            event: new EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'common',
                    chanceToGenerate: 0.7,        
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
            event: new EventTileMonster(`You've found the leader of the goblins!`,CreatureId.GoblinChief),
            coords: [
                {x:3,y:11},
            ],
        },
        {
            event: new EventTileLootable({
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
            event: new EventTileWarp({}),
            coords: [
                {x:3,y:13},
            ],
        },
    ]
};