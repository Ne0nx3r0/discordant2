import {EventTile} from "./EventTile";
import { IMapData } from './IMapData';
import ItemId from '../item/ItemId';
import ItemBase from '../item/ItemBase';
import { EventTileForagable } from "./tiles/EventTileForagable";
import { Acai } from "../item/ItemsIndex";

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
    pieceItem?: ItemBase;
    mapItem?: ItemBase;
}

export default class ExplorableMap{
    fileName:string;
    title:string;
    pathLayer:number;
    foragablesLayer:number;
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

            if(layer.name == 'path'){
                this.pathLayer = i; 
            }
            else if(layer.name == 'foragables'){
                this.foragablesLayer = i;
            }
        }

        if(this.pathLayer === undefined){
            throw 'No path layer defined in map '+this.fileName;
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
        return this.mapJson.layers[this.pathLayer].data[this._fromXY(x,y)] == 1;
    }

    getForagableTile(x:number,y:number):EventTile | null{
        const foragablesLayer = this.mapJson.layers[this.foragablesLayer];

        if(!foragablesLayer){
            return null;
        }

        const tileType:number = foragablesLayer.data[this._fromXY(x,y)];

        switch(tileType){
            case 0:
                return null;
            
            case 91: //Acai
                return new EventTileForagable('Acai',ItemId.Acai);

            case 121: //Sage
                return new EventTileForagable('Sage',ItemId.Sage);

            case 151: //Fox
                return new EventTileForagable('Fox',ItemId.Fox);

            case 181: //Yerba
                return new EventTileForagable('Yerba',ItemId.Yerba);

            case 211: //Agave
                return new EventTileForagable('Agave',ItemId.Agave);

            case 241: //Bane 1
            case 242: //Bane 2
            case 271: //Bane 3
            case 272: //Bane 4
                return new EventTileForagable('Bane',ItemId.Bane);

            case 301: //Red Mushroom        
                return new EventTileForagable('Red Mushroom',ItemId.RedMushroom);

            case 331: //Blue Mushroom
                return new EventTileForagable('Blud Mushroom',ItemId.BlueMushroom);

            //case 32: // Loot Common
            //case 34: // Loot Rare
        }

        return null;
    }

    _fromXY(x:number,y:number):number{
        return ( y - 1 ) * this.mapJson.width + x - 1;
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