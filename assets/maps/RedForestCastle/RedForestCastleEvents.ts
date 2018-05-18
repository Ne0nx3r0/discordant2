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
import { MapRedForest } from "../../../src/core/map/Maps";
import { EventTileDoor } from "../../../src/core/map/tiles/EventTileDoor";
import { DamageType } from "../../../src/core/item/WeaponAttackStep";
import { EventTile,EventTileHandlerBag } from "../../../src/core/map/EventTile";
import { ExiledMagicianWeapon } from '../../../src/core/item/weapons/ExiledMagicianWeapon';

class EventTileGetRedCastleLever extends EventTile{
    constructor(){
        super({
            stopsPlayer: true
        });
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const leverSetOpen = bag.metadata.getMapData(`leverSetOpen`);   

        if(!leverSetOpen){
            bag.party.sendCurrentMapImageFile(`A strange lever... (\`di\` to use)`);
        }
        else{
            bag.party.sendCurrentMapImageFile(`A strange lever, it appears to be in the ON position`);
        }

        return true;
    }

    onInteract(bag:EventTileHandlerBag):boolean{
        const leverSetOpen = bag.metadata.getMapData(`leverSetOpen`);   

        if(!leverSetOpen){
            bag.metadata.setMapData('leverSetOpen',true);

            bag.party.sendChannelMessage(`A loud series of clicks echo throughout the castle`);
        }
        else{
            bag.party.sendChannelMessage(`Nothing happens...`);
        }

        return true;
    }
}

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('uncommon',ItemsIndex.Revive,0.5);
lootGenerator.addLootItem('uncommon',ItemsIndex.Tent,0.5);
lootGenerator.addLootItem('uncommon',ItemsIndex.RedForestCastleMapPiece,0.5);
lootGenerator.addLootItem('uncommon',ItemsIndex.MageRobe,0.1);
lootGenerator.addLootItem('uncommon',ItemsIndex.SonicLongsword,0.1);
lootGenerator.addLootItem('uncommon',ItemsIndex.RedEyeRing,0.1);
lootGenerator.addLootItem('uncommon',ItemsIndex.RingOfHealth,1);
lootGenerator.addLootItem('uncommon',ItemsIndex.RingOfLuck,1);

lootGenerator.addLootItem('rare',ItemsIndex.TabletOfFaith,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.StoneDagger,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.StoneAxe,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.FireSpear,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.FireDagger,0.1);
lootGenerator.addLootItem('rare',ItemsIndex.FireMace,0.1);

export const RedForestCastleEvents:IMapData = {
    startX: 5,
    startY: 29,
    encounterChance: 0.25,
    pets: [],
    encounters:[
        { id:CreatureId.GhostHound, weight: 0.1 },
        { id:CreatureId.GhostGuardian,  weight: 0.3 },
        { id:CreatureId.GiantRat,       weight: 0.1 },
    ],
    eventTiles: [
        {
            event: new EventTileForagable('Blue Mushroom',ItemsIndex.BlueMushroom.id),
            coords: [
                {x:10,y:19},
                {x:11,y:20},
            ]
        },
        {
            event: new EventTileForagable('Red Mushroom',ItemsIndex.RedMushroom.id),
            coords: [
                {x:7,y:3},
                {x:10,y:3},
                {x:7,y:5},
                {x:6,y:16},
                {x:23,y:28},
                {x:26,y:28},
            ]
        },
        {
            event: new EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'uncommon',
                    chanceToGenerate: 0.8,        
                },
                wishesMax: 100,
                goldMax: 300,
            }),
            coords: [
                {x:5,y:14},
                {x:25,y:25},
                {x:26,y:26},
                {x:16,y:32},
                {x:18,y:32},
            ],
        },
        {
            event: new EventTileLootable({
                lootGenerator: lootGenerator,
                lootSettings:{
                    startingNode: 'rare',
                    chanceToGenerate: 1,        
                },
                wishesMax: 200,
                goldMax: 400,
            }),
            coords: [
                {x:17,y:12},
                {x:20,y:12},
            ],
        },
        //Boss
        {
            event: new EventTileMonster(`You have unlocked the immortal exiled magician!`,CreatureId.ExiledMagician),
            coords: [
                { x: 18, y: 13 },
            ],
        },
        {
            event: new EventTileGetRedCastleLever(),
            coords: [ { x:18, y:5 } ],
        },
        // Castle exit
        {
            event: new EventTileWarp({
                mapTitle: 'RED FOREST',
                toCoordinate: {
                    x: 5,
                    y: 3,
                },
                message: 'You exit the castle',
                warpOnEnter: true,
            }),
            coords: [
                { x: 5, y: 30 },
                { x: 6, y: 30 },
            ],
        },
        //top left door (single)
        {
            event: new EventTileDoor({
                from: [{ x: 5, y: 16 }],
                to: [{ x: 5, y: 19 }],
                chanceTrapped: 0.5,
                trap: {
                    type: DamageType.fire,
                    amount: Math.round(Math.random() * 60 + 10),
                },
            }),
            coords: [
                { x: 5, y: 16 },
                { x: 5, y: 19 },
            ],
        },
        //Bottom middle door (single)
        {
            event: new EventTileDoor({
                from: [{ x: 17, y: 27 }],
                  to: [{ x: 17, y: 30 }],
                chanceTrapped: 0.5,
                trap: {
                    type: DamageType.fire,
                    amount: Math.round(Math.random() * 60 + 10),
                },
            }),
            coords: [
                { x: 17, y: 27 },
                { x: 17, y: 30 },
            ],
        },
        //top right door (double)
        {
            event: new EventTileDoor({
                from: [{ x: 14, y: 4 },{ x: 14, y: 5 }],
                  to: [{ x: 16, y: 4 },{ x: 16, y: 5 }],
                chanceTrapped: 0.5,
                trap: {
                    type: DamageType.thunder,
                    amount: Math.round(Math.random() * 60 + 1),
                },
            }),
            coords: [
                { x: 14, y: 4 },
                { x: 14, y: 5 },
                { x: 16, y: 4 },
                { x: 16, y: 5 },
            ],
        },
        // bottom right door (double)
        {
            event: new EventTileDoor({
                from: [{ x: 21, y: 26 },{ x: 21, y: 27 }],
                  to: [{ x: 23, y: 26 },{ x: 23, y: 27 }],
                chanceTrapped: 0.5,
                trap: {
                    type: DamageType.fire,
                    amount: Math.round(Math.random() * 50 + 10),
                },
            }),
            coords: [
                { x: 21, y: 26 },
                { x: 21, y: 27 },
                { x: 23, y: 26 },
                { x: 23, y: 27 },
            ],
        },
        // middle left door (single)
        {
            event: new EventTileDoor({
                from: [{ x: 14, y: 5 }],
                  to: [{ x: 16, y: 5 }],
                chanceTrapped: 0.5,
                trap: {
                    type: DamageType.fire,
                    amount: Math.round(Math.random() * 50 + 10),
                },
            }),
            coords: [
                { x: 14, y: 5 },
                { x: 16, y: 5 },
            ],
        },
        // stairs
        {
            event: new EventTileDoor({
                from: [{x: 9, y: 8},{x: 10, y: 8}],
                  to: [{x: 12, y: 25},{x: 13, y: 25}],
                  chanceTrapped: 0,
                  enterMessage: 'A set of stairs (`di` to interact)',
            }),
            coords: [
                {x: 9, y: 8},
                {x: 10, y: 8},
                {x: 12, y: 25},
                {x: 13, y: 25},
            ],
        },
        // boss door
        {
            event: new EventTileDoor({
                from: [{x: 18, y: 16},{x: 19, y: 16}],
                    to: [{x: 18, y: 19},{x: 19, y: 19}],
                    isOpen: function(bag){
                        return bag.metadata.getMapData('leverSetOpen') as boolean;
                    },
            }),
            coords: [
                {x: 18, y: 16},
                {x: 19, y: 16},
                {x: 18, y: 19},
                {x: 19, y: 19},
            ],
        },
    ]
};