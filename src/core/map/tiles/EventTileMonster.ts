import EventTile from '../EventTile';

export function EventTileMonster(announcement:string,monsterId:number){
    return new EventTile({
        onEnter: function(bag){
            if(bag.runCount == 0){  
                bag.sendPartyMessage(announcement);

                bag.party.monsterEncounter(monsterId);
            }
        }
    });
}