import { Coordinate } from "./EventTile";

export default class MapMetaDataCache {
    tileData:Map<string,Map<any,any>>;
    mapData:Map<any,any>;
    
    constructor(){
        this.tileData = new Map();
        this.mapData = new Map();    
    }

    setTileData(coordinate:Coordinate,key:any,value:any){
        const coordinateStr = coordinate.x +'-'+coordinate.y;

        let tileDatum = this.tileData.get(coordinateStr);

        if(!tileDatum){
            tileDatum = new Map();

            this.tileData.set(coordinateStr,tileDatum);
        }

        tileDatum.set(key,value);
    }

    getTileData(coordinate:Coordinate,key:any){ 
        const coordinateStr = coordinate.x +'-'+coordinate.y;

        let tileDatum = this.tileData.get(coordinateStr);

        if(tileDatum){
            return tileDatum.get(key);
        }
    }

    setMapData(key:any,value:any){
        this.mapData.set(key,value);
    }

    getMapData(key:any){
        return this.mapData.get(key);
    }
}