import { IMapData } from "../../../src/core/map/IMapData";
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";
import EventTileLootable from "../../../src/core/map/tiles/EventTileLootable";
import LootGenerator from "../../../src/core/loot/LootGenerator";
import * as ItemsIndex from '../../../src/core/item/ItemsIndex';
import { EventTileSpecificItem } from "../../../src/core/map/tiles/EventTileSpecificItem";
import { EventTile, EventTileHandlerBag } from "../../../src/core/map/EventTile";
import CreatureId from "../../../src/core/creature/CreatureId";
import EventTileMonster from "../../../src/core/map/tiles/EventTileMonster";
import EventTileWarp from "../../../src/core/map/tiles/EventTileWarp";

export const Tutorial2Events:IMapData = {
    startX: 8,
    startY: 10,
    encounterChance: 0.25,
    encounters:[
        { id:CreatureId.GiantFly, weight: 1 },
    ],
    eventTiles: [
        {
            coords: [
                {
                    x: 8,
                    y: 10,
                },
            ],
            event: new EventTileEnterMessage({
                stopsPlayer: true,
                message: 'You arrived at the next map!',
            }),
        },
        {
            event: new EventTileWarp({
                warpOnEnter: true,
                mapTitle: 'Tutorial',
                toCoordinate: {
                    x: 4,
                    y: 2,
                },
                message: 'You head back to the first map',
            }),
            coords: [
                {
                    x: 8,
                    y: 10,
                },
                {
                    x: 9,
                    y: 10,
                },
            ],
        },  
        {
            coords:[
                {
                    x: 3,
                    y: 7,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'You found some loot! Collect it with `dinteract` or just `di`',
                interactMessage: 'You found a cloth hood!\n\nYou can equip it with `dequip cloth hood`',
                item: ItemsIndex.ClothHood,
            }),  
        },
        {
            event: new EventTileMonster(`You found a boss!`,CreatureId.GiantWasp),
            coords: [
                {
                    x: 5,
                    y: 3,
                },
            ],
        },
        {
            coords:[
                {
                    x: 5,
                    y: 2,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'You found some loot! Collect it with `dinteract` or just `di`',
                interactMessage: 'You found an amulet of health!\n\nYou can equip it with `dequip amulet of health`\n\nNice job completing the tutorial!\n\nWhen you\'re ready, you can use `dpdisband` to exit the tutorial!',
                item: ItemsIndex.AmuletOfHealth,
            }),  
        },
    ],
};