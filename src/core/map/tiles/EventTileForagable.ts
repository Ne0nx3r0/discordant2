import {EventTile, EventTileHandlerBag} from '../EventTile';
import ItemId from '../../item/ItemId';

export class EventTileForagable extends EventTile{
    title: string;
    itemId: ItemId;
    
    constructor(title:string,itemId:ItemId){
        super({
            stopsPlayer: false,
        });

        this.title = title;
        this.itemId = itemId;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const foragedAlready:boolean = bag.metadata.getTileData(bag.coordinate,'foragedAlready');

        if(!foragedAlready){
            bag.party.sendCurrentMapImageFile(`There's a small patch of ${this.title} plants. (\`di\` to interact)`);

            return true;
        }

        return false;
    }

    onInteract(bag:EventTileHandlerBag):boolean{
        const foragedAlready:boolean = bag.metadata.getTileData(bag.coordinate,'foragedAlready');

        if(!foragedAlready){
            bag.party.sendChannelMessage(`${bag.player.title} found one ${this.title} for each party member`);

            bag.player.party.members.forEach((pc)=>{
                bag.party.game.grantPlayerItem(pc.uid,this.itemId,1);
            });

            bag.metadata.setTileData(bag.coordinate,'foragedAlready',true);

            return true;
        }

        return false;
    }
}