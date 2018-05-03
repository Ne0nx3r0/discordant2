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
import EventTile from '../../../src/core/map/EventTile';
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('common',ItemsIndex.Vial,1);
//lootGenerator.addLootItem('common',ItemId.MapAfterRedForestPiece,1);
//lootGenerator.addLootItem('rare',ItemId.MapAfterRedForestPiece,0.2);

export const LivingWoodsEvents:IMapData = {
    startX: 30,
    startY: 37,
    encounterChance: 0.1,
    encounters:[
        { id:CreatureId.WillOWisp,    weight: 1 },
    ],
    eventTiles: [
        
    ]
};