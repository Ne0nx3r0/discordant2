import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';

export function EventTileForagable(title:string,itemId:ItemId){
    return new EventTile({
        onEnter: function(bag){
            if(bag.runCount == 0){
                bag.sendPartyMessage(`There's a small patch of ${title} shrubs.`);
            }
        },
        onInteract: function(bag){
            if(bag.runCount == 0){
                bag.sendPartyMessage(`${bag.player.title} found ${title}!`);

                bag.party.game.grantPlayerItem(bag.player.uid,itemId,1);

                return true;
            }
            else{
                return false;
            }
        }
    });
}