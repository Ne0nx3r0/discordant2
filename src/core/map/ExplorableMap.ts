import EventTile from "./EventTile";
import { IMapData } from './IMapData';
import ItemId from '../item/ItemId';
import ItemBase from '../item/ItemBase';

interface StartingPoint {
    x:number;
    y:number;
}

interface MapLayer{
    name:string;
    data:Array<number>;
}

interface MapJson{
    layers:Array<MapLayer>;
    height:number;
    width:number;
    tileheight:number;
    tilewidth:number;
}

interface MapDataMonsterEncounter{
    id:number;
    weight:number;
}

interface MapDataTrigger{
    x:number;
    y:number;
    map?:string;
    mapX?:number;
    mapY?:number;
}

interface MapDataJson{
    encounterChance:number;
    encounters:Array<MapDataMonsterEncounter>;
    portals:Array<MapDataTrigger>;
}

interface IExplorableMapBag{
    fileName:string;
    title:string;
    mapJson:MapJson;
    mapData:IMapData;
    pieceItem: ItemBase;
    mapItem: ItemBase;
}

export default class ExplorableMap{
    fileName:string;
    title:string;
    triggersLayer:number;
    mapJson:MapJson;
    mapData:IMapData;
    eventTiles:Map<string,EventTile>;
    pieceItem: ItemBase;
    mapItem: ItemBase;

    constructor(bag:IExplorableMapBag){
        this.fileName = bag.fileName;
        this.title = bag.title;
        this.mapJson = bag.mapJson;
        this.mapData = bag.mapData;
        this.mapItem = bag.mapItem;
        this.pieceItem = bag.pieceItem;
        
        for(var i=0;i<this.mapJson.layers.length;i++){
            const layer = this.mapJson.layers[i];

            if(layer.name == 'walls'){
                this.triggersLayer = i;
                break; 
            }
        }

        if(this.triggersLayer === undefined){
            throw 'No walls layer defined in map '+this.fileName;
        }

        this.eventTiles = new Map();

        bag.mapData.eventTiles.forEach((mapEventTile)=>{
            mapEventTile.coords.forEach((coords)=>{
                this.eventTiles.set(coords.x+'-'+coords.y,mapEventTile.event);
            });
        });
    }

    getMapSlicePath(x:number,y:number):string{
        return './assets/maps/'+this.fileName+'/slices/'+x+'-'+y+'.png';
    }

    isWalkable(x:number,y:number):boolean{
        return this.mapJson.layers[this.triggersLayer].data[(y-1)*this.mapJson.width+x-1] != 1;
    }

    getEncounterChance(){
        return this.mapData.encounterChance;
    }

    getTileEvent(xDashY:string){
        return this.eventTiles.get(xDashY);
    }

    getRandomEncounterMonsterId(){
        let totalWeight = 0;
        
        this.mapData.encounters
        .forEach(function(encounter){
            totalWeight += encounter.weight;
        });

        const roll = Math.random() * totalWeight;
        let currentWeight = 0;

        for(var i=0;i<this.mapData.encounters.length;i++){
            const encounter = this.mapData.encounters[i];

            currentWeight += encounter.weight;

            if(roll < currentWeight){
                return encounter.id;
            }
        }
    }
}