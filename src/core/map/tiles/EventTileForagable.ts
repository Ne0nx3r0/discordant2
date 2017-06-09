import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';

export function EventTileForagable(title:string,itemId:ItemId){
    return new EventTile({
        stopsPlayer: false,
        onEnter: function(bag){
            if(bag.runCount == 0){
                bag.sendPartyMessage(`There's a small patch of ${title} plants. (\`di\` to interact)`);
            }
        },
        onInteract: function(bag){
            if(bag.runCount == 0){
                bag.sendPartyMessage(`${bag.player.title} found one ${title} for each party member`);

                bag.player.party.members.forEach(function(pc){
                    bag.party.game.grantPlayerItem(pc.uid,itemId,1);
                });

                return true;
            }
            else{
                return false;
            }
        }
    });
}