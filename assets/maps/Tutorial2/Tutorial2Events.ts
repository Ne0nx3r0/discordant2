import { IMapData } from "../../../src/core/map/IMapData";
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";
import EventTileLootable from "../../../src/core/map/tiles/EventTileLootable";
import LootGenerator from "../../../src/core/loot/LootGenerator";
import * as ItemsIndex from '../../../src/core/item/ItemsIndex';
import { EventTileSpecificItem } from "../../../src/core/map/tiles/EventTileSpecificItem";
import { EventTile, EventTileHandlerBag } from "../../../src/core/map/EventTile";
import CreatureId from "../../../src/core/creature/CreatureId";
import EventTileMonster from "../../../src/core/map/tiles/EventTileMonster";

export const TutorialEvents:IMapData = {
    startX: 8,
    startY: 9,
    encounterChance: 0.25,
    encounters:[
        { id:CreatureId.GiantFly, weight: 1 },
    ],
    eventTiles: [
        {
            coords:[
                {
                    x: 3,
                    y: 7,
                },
            ],
            event: new EventTileSpecificItem({
                enterMessage: 'You found some loot! Collect it with `dinteract` or just `di`',
                interactMessage: 'You found a cloth hood! You can equip it with `dequip cloth hood`',
                item: ItemsIndex.ClothHood,
            }),  
        },
        {
            event: new EventTileMonster(`You found a boss!`,CreatureId),
            coords: [
                {x:3,y:11},
            ],
        },
    ],
};