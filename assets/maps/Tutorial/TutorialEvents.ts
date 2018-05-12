import { IMapData } from "../../../src/core/map/IMapData";
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";
import EventTileLootable from "../../../src/core/map/tiles/EventTileLootable";
import LootGenerator from "../../../src/core/loot/LootGenerator";
import * as ItemsIndex from '../../../src/core/item/ItemsIndex';
import { EventTileSpecificItem } from "../../../src/core/map/tiles/EventTileSpecificItem";

export const TutorialEvents:IMapData = {
    startX: 3,
    startY: 13,
    encounterChance: 0,
    encounters:[
        
    ],
    eventTiles: [
        {
            coords: [
                {
                    x: 3,
                    y: 13,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Welcome to the tutorial!\n\nHere\'s where you are right now!\n\nTry typing `dpmove left`',
            }),
        },
        {
            coords: [
                {
                    x: 2,
                    y: 13,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Now try `dpmove up 3`',
            }),
        },
        {
            coords: [
                {
                    x: 2,
                    y: 10,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Nice job! What about `dpmove right 200`?',
            }),
        },
        {
            coords: [
                {
                    x: 8,
                    y: 10,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Ran into a wall? No worries! Why not explore a bit?',
            }),
        },
        {
            coords:[
                {
                    x: 7,
                    y: 7,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'Hey you found some loot!\n\n`dinteract` to grab it!',
                interactMessage: 'You got a mace!\n\nTry `dequip mace` to use it!',
                item: ItemsIndex.Mace,
            }),
        },
        {
            coords:[
                {
                    x: 2,
                    y: 6,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'You found a hidden item! Sometimes these are scattered about. `dinteract` to grab it!',
                interactMessage: 'You found a cloth tunic! You can use `ditem cloth tunic` to read about it or `dequip cloth tunic` to put it on!',
                item: ItemsIndex.ClothTunic,
            }),
        },
        {
            coords:[
                {
                    x: 5,
                    y: 4,
                },
                {
                    x: 6,
                    y: 4,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'You can collect plants like this one with `dinteract`!',
                interactMessage: 'You got an acai berry! You can use it in battle or run `dcraft vial` to turn it into a health vial!',
                item: ItemsIndex.Acai,
            }),  
        },
    ],
};