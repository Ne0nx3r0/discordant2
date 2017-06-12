import EventTile, { EventTileHandlerBag } from '../EventTile';
import CreatureId from '../../creature/CreatureId';

export default class EventTileMonster extends EventTile{
    announcement: string;
    monsterId: CreatureId;

    constructor(announcement:string,monsterId:number){
        super({
            stopsPlayer: true,
        });

        this.announcement = announcement;
        this.monsterId = monsterId;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const hasFired:boolean = bag.metadata.getTileData(bag.coordinate,'hasFired');

        if(!hasFired){  
            bag.metadata.setTileData(bag.coordinate,'hasFired',true);

            bag.party.sendChannelMessage(this.announcement);

            bag.party.monsterEncounter(this.monsterId);

            return true;
        }
        
        return false;
    }
}