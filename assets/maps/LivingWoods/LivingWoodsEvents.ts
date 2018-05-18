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

lootGenerator.addLootItem('common',ItemsIndex.Vial,2);
lootGenerator.addLootItem('common',ItemsIndex.LivingWoodsMapPiece,2);
lootGenerator.addLootItem('common',ItemsIndex.RingOfSpirit,1);
lootGenerator.addLootItem('common',ItemsIndex.RingOfStrength,1);
lootGenerator.addLootItem('common',ItemsIndex.RingOfAgility,1);
lootGenerator.addLootItem('common',ItemsIndex.RingOfStrength,1);
lootGenerator.addLootItem('common',ItemsIndex.StuddedLeather,1);
lootGenerator.addLootItem('common',ItemsIndex.StuddedHelmet,1);
lootGenerator.addLootItem('common',ItemsIndex.WoodShield,1);
lootGenerator.addLootItem('common',ItemsIndex.PointyMageHat,1);

lootGenerator.addLootItem('rare',ItemsIndex.Tent,1);
lootGenerator.addLootItem('rare',ItemsIndex.Revive,1);
lootGenerator.addLootItem('rare',ItemsIndex.GreedyDagger,0.5);
lootGenerator.addLootItem('rare',ItemsIndex.Kukri,1);
lootGenerator.addLootItem('rare',ItemsIndex.FireSpear,1);
lootGenerator.addLootItem('rare',ItemsIndex.TabletOfThunder,1);
lootGenerator.addLootItem('rare',ItemsIndex.TabletOfHealing,1);

export const LivingWoodsEvents:IMapData = {
    startX: 27,
    startY: 27,
    encounterChance: 0.1,
    pets: [],
    encounters:[
        { id:CreatureId.WillOWisp, weight: 2 },
        { id:CreatureId.Faun, weight: 4 },
        { id:CreatureId.Treant, weight: 1 },
    ],
    eventTiles: [
        {
            event: new EventTileMonster(`Out of the trees comes a dark growling figure!`,CreatureId.Werewolf),
            coords: [
                {x:14,y:16},
            ],
        },
        {
            event: new EventTileMonster(`Small fairies come flying towards you from every direction!`,CreatureId.CorruptedFairies),
            coords: [
                {x:23,y:12},
            ],
        },
        {
            event: new EventTileMonster(`You've awoken the old willow tree!`,CreatureId.OldWillow),
            coords: [
                {x:12,y:15},
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
                {x:12, y:3},
                {x:9, y:19},
                {x:26, y:5},
                {x:27, y:8},
                {x:27, y:20},
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
                {x:6, y:8},
                {x:13, y:15},
                {x:24, y:11},
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