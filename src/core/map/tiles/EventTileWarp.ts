import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';
import { IGenerateLootBag } from "../../loot/LootGenerator";
import ItemBase from "../../item/ItemBase";
import ExplorableMap from "../ExplorableMap";

// If the map isn't defined it will lead to town
// If the same map the map will not be reset
// If x/y are defined that position will be set as the current position
interface EventTileWarpBag{
    map?:ExplorableMap;
    x?:number;
    y?:number; 
    message?: string;
}

export function EventTileWarp(tileBag:EventTileWarpBag){
    return new EventTile({
        onEnter: function(bag){
            if(bag.runCount == 0){
                const destination = tileBag.map ? 'to '+tileBag.map.title : 'back to town';
console.log(tileBag,bag);
                bag.party.sendChannelMessage(tileBag.message || `A warp pad leading ${destination}`);
            }
        },
        onInteract: function(bag){
            //portal to town
            if(!tileBag.map){
                bag.party.returnToTown();
            }
            //portal to the same map
            else if(tileBag.map.fileName == bag.party.exploration.map.fileName){
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
                bag.party.explore(tileBag.map,tileBag.x,tileBag.y);
            }
            //portal to some other map, no x/y so use start location
            else{
                bag.party.explore(tileBag.map);
            }

            return true;
        }
    });
}