import EventTile from '../EventTile';
import ItemId from '../../item/ItemId';

export function EventTileDrinkableWater(){
    return new EventTile({
        stopsPlayer: false,
        onEnter: function(bag){
            bag.sendPartyMessage(`Clean looking water, why not have a drink?`);
        },
        onInteract: function(bag){
            bag.party.members.forEach(function(member){
                if(member.hpCurrent < member.stats.hpTotal){
                    member.hpCurrent = Math.min(member.stats.hpTotal,member.hpCurrent+20);
                }
            });

            bag.party.sendChannelMessage(`The party rests and has a refreshing drink of water! (+20hp to all party members)`);

            if(0.5 > Math.random()){
                bag.party.randomMonsterEncounter();
            }

            return true;
        }
    });
}