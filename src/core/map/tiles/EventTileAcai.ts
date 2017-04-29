import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';

export const EventTileAcai = new EventTile({
    onEnter: function(bag){
        if(bag.runCount == 0){
            bag.sendPartyMessage(`There's a small patch of acai plants.`);
        }
    },
    onInteract: function(bag){
        if(bag.runCount == 0){
            bag.sendPartyMessage(`${bag.player.title} found an acai berry!`);

            bag.game.grantPlayerItem(bag.player.uid,ItemId.Acai,1);

            return true;
        }
        else{
            return false;
        }
    }
});