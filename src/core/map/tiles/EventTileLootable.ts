import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';

const DEBRIS_MESSAGES = [
    `Looks like a small skirmish took place here... Maybe something useful is left?`,
    `Someone left a burlap sack on the ground. Coud be a trap.`,
    `A large cracked chest left behind from a caravan or passing trader`,
];

export function EventTileLootable(title:string,itemId:ItemId){
    return new EventTile({
        onEnter: function(bag){
            if(bag.runCount == 0){
                bag.sendPartyMessage(DEBRIS_MESSAGES[Math.floor(DEBRIS_MESSAGES.length*Math.random())]);
            }
        },
        onInteract: function(bag){
            if(bag.runCount == 0){
                const lootItemId = bag.lootGenerator

                bag.sendPartyMessage(``);

                bag.player.party.members.forEach(function(pc){
                    bag.game.grantPlayerItem(pc.uid,itemId,1);
                });

                return true;
            }
            else{
                return false;
            }
        }
    });
}