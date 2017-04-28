import EventTile from "./EventTile";

interface IMapEncounter {
    id: number;
    weight: number;//relative percent chance to spawn this mob
}

export interface IMapData{
    encounterChance: number;//percent change to spawn an encounter
    encounters: Array<IMapEncounter>;
    eventTiles: Array<EventTile>;
}