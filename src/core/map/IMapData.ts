import {EventTile} from "./EventTile";

interface MapEventTile {
    event: EventTile;
    coords: Array<{x:number,y:number}>;
}

interface IMapEncounter {
    id: number;
    weight: number;//relative percent chance to spawn this mob
}

export interface IMapData{
    encounterChance: number;//percent change to spawn an encounter
    encounters: IMapEncounter[];
    eventTiles: MapEventTile[];
    startX: number;
    startY: number;
}