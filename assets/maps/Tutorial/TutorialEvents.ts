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
                    x: 6,
                    y: 17,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'Here\'s where you are right now!\n\nTry typing `dpm left`',
            }),
        }
    ],
};