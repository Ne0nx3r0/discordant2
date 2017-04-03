const TRIGGER_START_POINT = 2;

interface StartingPoint{
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

export default class{
    name:string;
    triggersLayer:number;
    mapJson:MapJson;
    mapDataJson:MapDataJson;

    constructor(name:string,mapJson:MapJson,mapDataJson:MapDataJson){
        this.name = name;
        this.mapJson = mapJson;
        this.mapDataJson = mapDataJson;
        
        for(var i=0;i<this.mapJson.layers.length;i++){
            const layer = this.mapJson.layers[i];

            if(layer.name == 'triggers'){
                this.triggersLayer = i;
                break; 
            }
        }

        if(this.triggersLayer === undefined){
            throw 'No trigger layer defined in map '+this.name;
        }
    }

    getMapSlicePath(x:number,y:number):string{
        return './assets/maps/'+this.name+'/slices/'+x+'-'+y+'.png';
    }

    getStartingPoint():StartingPoint{
        const triggerData = this.mapJson.layers[this.triggersLayer].data;

        for(var i=0;i<triggerData.length;i++){
            if(triggerData[i] == TRIGGER_START_POINT){
                return {
                    x: i % this.mapJson.width + 1,
                    y: Math.floor(i/this.mapJson.width)+1,
                };
            }
        }

        throw 'Starting point not found for map '+this.name;
    }

    isWalkable(x,y):boolean{
        return this.mapJson.layers[this.triggersLayer].data[(y-1)*this.mapJson.width+x-1] != 1;
    }

    getEncounterChance(){
        return this.mapDataJson.encounterChance;
    }

    getRandomEncounterMonsterId(){
        let totalWeight = 0;
        
        this.mapDataJson.encounters
        .forEach(function(encounter){
            totalWeight += encounter.weight;
        });

        const roll = Math.random() * totalWeight;
        let currentWeight = 0;

        for(var i=0;i<this.mapDataJson.encounters.length;i++){
            const encounter = this.mapDataJson.encounters[i];

            currentWeight += encounter.weight;

            if(roll < currentWeight){
                return encounter.id;
            }
        }
    }
}