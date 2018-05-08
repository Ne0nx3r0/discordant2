import{  EventTile, EventTileHandlerBag } from '../EventTile';
import ItemId from '../../item/ItemId';

export class EventTileDrinkableWater extends EventTile{
    constructor(){
        super({
            stopsPlayer: false,
        });
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        bag.party.sendCurrentMapImageFile(`Clean looking water, why not have a drink?`);

        return true;
    }

    onInteract(bag:EventTileHandlerBag):boolean {
        bag.party.members.forEach(function(member){
            if(member.hpCurrent < member.stats.hpTotal){
                member.hpCurrent = Math.min(member.stats.hpTotal,member.hpCurrent+50);
            }
        });

        bag.party.sendChannelMessage(`The party rests and has a refreshing drink of water! (+50hp to all party members)`);

        if(0.25 > Math.random()){
            bag.party.randomMonsterEncounter();
        }

        return true;
    }
}