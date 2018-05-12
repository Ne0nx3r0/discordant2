import { IMapData } from "../../../src/core/map/IMapData";
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";

export const TutorialEvents:IMapData = {
    startX: 6,
    startY: 17,
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
                message: 'Welcome to the tutorial!\n\nHere\'s where you are right now!\n\nTry typing `dpm left`',
            }),
        },
        {
            coords: [
                {
                    x: 3,
                    y: 13,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Now try `dpm up 3`',
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
                message: 'Nice job! What about `dpm right 200`?',
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
    ],
};