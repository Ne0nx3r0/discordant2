import {EventTile} from "./EventTile";
import CreatureId from "../creature/CreatureId";

interface MapEventTile {
    event: EventTile;
    coords: Array<{x:number,y:number}>;
}

interface IMapEncounter {
    id: number;
    weight: number;//relative percent chance to spawn this mob
}

interface IPetEncounter{
    id: CreatureId;
    chance: number;//percent chance per tile move to generate a pet
}

export interface IMapData{
    encounterChance: number;//percent change to spawn an encounter
    pets: IPetEncounter[];
    encounters: IMapEncounter[];
    eventTiles: MapEventTile[];
    startX: number;
    startY: number;
}