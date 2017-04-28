import EventTile from '../EventTile';

export class EventTileAcai extends EventTile{
    constructor(x:number,y:number){
        super({
            x: x,
            y: y,
            onEnter: function(bag){
                if(bag.runCount == 0){
                    bag.sendPartyMessage(`There's a small patch of acai plants.`);
                    return true;
                }
                return false;
            },
            onInteract: function(bag){
                if(bag.runCount == 0){
                    bag.sendPartyMessage(`You don't find anything of interest`);
                    return true;
                }
                else{
                    return false;
                }
            }
        });
    }
}