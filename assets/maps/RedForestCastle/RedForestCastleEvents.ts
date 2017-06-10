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
import { MapRedForest } from "../../../src/core/map/Maps";

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

export const RedForestCastleEvents:IMapData = {
    startX: 5,
    startY: 29,
    encounterChance: 0,
    encounters:[
        { id:CreatureId.GuardianSpirit, weight: 0.3 },
        { id:CreatureId.GuardianHound,  weight: 0.3 },
        { id:CreatureId.GiantRat,       weight: 0.1 },
    ],
    eventTiles: [
        {
            event: EventTileForagable('Acai',ItemId.Acai),
            coords: [
                {x:20,y:24},
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
            ],
        },
        {
            event: EventTileMonster(`You've found the leader of the goblins!`,CreatureId.GoblinChief),
            coords: [
                { x: 3, y: 11 },
            ],
        },
        {
            event: EventTileWarp({
                mapTitle: 'RED FOREST',
                x: 5,
                y: 3,
                message: 'You exit the castle'
            }),
            coords: [
                { x: 5, y: 30 },
                { x: 6, y: 30 },
            ],
        },
    ]
};