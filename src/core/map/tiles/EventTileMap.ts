import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';
import { IGenerateLootBag } from "../../loot/LootGenerator";
import ItemBase from "../../item/ItemBase";

interface EventTileMapBag{
    map: ItemBase;
}

export function EventTileMap(tileBag:EventTileMapBag){
    return new EventTile({
        onEnter: function(bag){
            if(bag.runCount == 0){
                bag.party.sendChannelMessage(`What's this? A map containing directions to a new land!`);
            }
        },
        onInteract: function(bag){
            if(bag.runCount == 0){
                bag.party.members.forEach(function(member){
                    bag.party.game.grantPlayerItem(member.uid,tileBag.map
                    .id,1);
                });
                
                bag.party.sendChannelMessage(`The party discovered ${tileBag.map.title} (Note: map doesn't work yet, more maps coming soon!)`);

                return true;
            }
            return false;
        }
    });
}