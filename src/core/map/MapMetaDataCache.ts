import { Coordinate } from "./EventTile";

export default class MapMetaDataCache {
    tileData:Map<Coordinate,Map<any,any>>;
    mapData:Map<any,any>;
    
    constructor(){
        this.tileData = new Map();
        this.mapData = new Map();    
    }

    setTileData(coordinate:Coordinate,key:any,value:any){
        let tileDatum = this.tileData.get(coordinate);

        if(!tileDatum){
            tileDatum = new Map();

            this.tileData.set(coordinate,tileDatum);
        }

        tileDatum.set(key,value);
    }

    getTileData(coordinate:Coordinate,key:any){
        let tileDatum = this.tileData.get(coordinate);

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