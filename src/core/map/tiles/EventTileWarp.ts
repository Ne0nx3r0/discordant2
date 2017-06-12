import EventTile, { EventTileHandlerBag, Coordinate } from '../EventTile';
import ItemId from '../../item/ItemId';
import { IGenerateLootBag } from "../../loot/LootGenerator";
import ItemBase from "../../item/ItemBase";
import ExplorableMap from "../ExplorableMap";
import { WorldMaps } from "../Maps";

// If the map isn't defined it will lead to town
// If the same map the map will not be reset
// If x/y are defined that position will be set as the current position
interface EventTileWarpBag{
    mapTitle?:string;
    warpOnEnter?: boolean;
    toCoordinate?: Coordinate;
    message?: string;
}

export default class EventTileWarp extends EventTile{
    mapTitle?:string;
    warpOnEnter?: boolean;
    toCoordinate?:Coordinate;
    message?: string;

    constructor(bag:EventTileWarpBag){
        super({
            stopsPlayer: true
        });

        this.mapTitle = bag.mapTitle;
        this.warpOnEnter = bag.warpOnEnter;
        this.toCoordinate = bag.toCoordinate;
        this.message = bag.message;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const map = WorldMaps[this.mapTitle.toUpperCase()];

        if(this.warpOnEnter){
            return this.onInteract(bag);
        }

        const destination = map ? 'to '+map.title : 'back to town';

        bag.party.sendChannelMessage(this.message || `A warp pad leading ${destination}`);

        return true;
    }

    onInteract(bag:EventTileHandlerBag):boolean{
        const map = WorldMaps[this.mapTitle.toUpperCase()];

        //portal to town
        if(!map){
            bag.party.returnToTown();
        }
        //portal to the same map
        else if(map.fileName == bag.party.exploration.map.fileName){
            if(this.toCoordinate){
                bag.party.exploration.moveTo(this.toCoordinate.x,this.toCoordinate.y);
            }
            //no x/y so move to start position anyway without resetting map
            else{
                bag.party.exploration.moveTo(this.toCoordinate.x,this.toCoordinate.y);
            }
        }
        //portal to another map, specific x/y
        else if(this.toCoordinate){
            bag.party.explore(map,this.toCoordinate.x,this.toCoordinate.y);
        }
        //portal to some other map, no x/y so use start location
        else{
            bag.party.explore(map);
        }

        return true;
    }
}