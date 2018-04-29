import CreatureId from '../../../src/core/creature/CreatureId';
import Creature from '../../../src/core/creature/Creature';
import { IMapData } from '../../../src/core/map/IMapData';
import { EventTileForagable } from '../../../src/core/map/tiles/EventTileForagable';
import ItemId from '../../../src/core/item/ItemId';
import EventTileLootable from "../../../src/core/map/tiles/EventTileLootable";
import EventTileMonster from "../../../src/core/map/tiles/EventTileMonster";
import EventTileWarp from "../../../src/core/map/tiles/EventTileWarp";
import LootGenerator from '../../../src/core/loot/LootGenerator';
import { EventTileDrinkableWater } from '../../../src/core/map/tiles/EventTileDrinkableWater';
import EventTile from '../../../src/core/map/EventTile';
import { MapRedForestCastle } from "../../../src/core/map/Maps";
import EventTileEnterMessage from "../../../src/core/map/tiles/EventTileEnterMessage";

export const lootGenerator = new LootGenerator();

lootGenerator.addLootItem('common',ItemId.Vial,1);
//lootGenerator.addLootItem('common',ItemId.MapAfterRedForestPiece,1);
//lootGenerator.addLootItem('rare',ItemId.MapAfterRedForestPiece,0.2);

export const LivingWoodsEvents:IMapData = {
    startX: 29,
    startY: 36,
    encounterChance: 0,
    encounters:[
        { id:CreatureId.Goblin,    weight: 0.3 },
    ],
    eventTiles: [
        
    ]
};