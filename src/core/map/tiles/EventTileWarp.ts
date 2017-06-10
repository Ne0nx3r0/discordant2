import EventTile, { EventTileHandlerBag } from '../EventTile';
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
    x?:number;
    y?:number; 
    message?: string;
}



export function EventTileWarp(tileBag:EventTileWarpBag){
    function warpParty(bag:EventTileHandlerBag):boolean{
        const map = WorldMaps[tileBag.mapTitle.toUpperCase()];

        //portal to town
        if(!map){
            bag.party.returnToTown();
        }
        //portal to the same map
        else if(map.fileName == bag.party.exploration.map.fileName){
            if(tileBag.x && tileBag.y){
                bag.party.exploration.moveTo(tileBag.x,tileBag.y);
            }
            //no x/y so move to start position anyway without resetting map
            else{
                bag.party.exploration.moveTo(tileBag.x,tileBag.y);
            }
        }
        //portal to another map, specific x/y
        else if(tileBag.x && tileBag.y){
            bag.party.explore(map,tileBag.x,tileBag.y);
        }
        //portal to some other map, no x/y so use start location
        else{
            bag.party.explore(map);
        }

        return true;
    }

    return new EventTile({
        onEnter: function(bag:EventTileHandlerBag){
            const map = WorldMaps[tileBag.mapTitle.toUpperCase()];

            if(bag.runCount == 0){
                if(tileBag.warpOnEnter){
                    warpParty(bag);
                    
                    return;
                }

                const destination = map ? 'to '+map.title : 'back to town';

                bag.party.sendChannelMessage(tileBag.message || `A warp pad leading ${destination}`);
            }
        },
        onInteract: warpParty
    });
}