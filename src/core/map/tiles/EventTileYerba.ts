import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';

export const EventTileAcai = new EventTile({
    onEnter: function(bag){
        if(bag.runCount == 0){
            bag.sendPartyMessage(`There's a small patch of yerba shrubs.`);
        }
    },
    onInteract: function(bag){
        if(bag.runCount == 0){
            bag.sendPartyMessage(`${bag.player.title} found a yerba flower!`);

            bag.game.grantPlayerItem(bag.player.uid,ItemId.Yerba,1);

            return true;
        }
        else{
            return false;
        }
    }
});