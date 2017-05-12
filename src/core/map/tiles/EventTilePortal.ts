import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';
import { IGenerateLootBag } from "../../loot/LootGenerator";
import ItemBase from "../../item/ItemBase";
import ExplorableMap from "../ExplorableMap";

//If the map isn't defined it will lead to town
interface EventTileWarpBag{
    toMap?:ExplorableMap; 
}

export function EventTileWarp(tileBag:EventTileWarpBag){
    return new EventTile({
        onEnter: function(bag){
            if(bag.runCount == 0){
                const destination = tileBag.toMap ? 'to '+tileBag.toMap.title : 'back to town';

                bag.party.sendChannelMessage(`A warp pad leading ${destination}`);
            }
        },
        onInteract: function(bag){
            if(!tileBag.toMap){
                bag.party.returnToTown();
            }
            else{
                bag.party.explore(tileBag.toMap);
            }

            return true;
        }
    });
}