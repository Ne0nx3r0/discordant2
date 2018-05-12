import{  EventTile, EventTileHandlerBag } from '../EventTile';
import ItemId from '../../item/ItemId';
import ItemBase from '../../item/ItemBase';

export interface BagSpecificItem{
    stopsPlayer?: boolean;
    enterMessage: string;
    interactMessage: string;
    item: ItemBase;
}

export class EventTileSpecificItem extends EventTile{
    interactMsg: string;
    enterMsg: string;
    item: ItemBase;

    constructor(bag:BagSpecificItem){
        super({
            stopsPlayer: bag.stopsPlayer || false,
        });

        this.interactMsg = bag.interactMessage;
        this.enterMsg = bag.enterMessage;
        this.item = bag.item;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const lootCollected:boolean = bag.metadata.getTileData(bag.coordinate,'lootCollected');

        if(lootCollected){
            return false;
        }

        bag.party.sendCurrentMapImageFile(this.enterMsg);

        return true;
    }

    onInteract(bag:EventTileHandlerBag):boolean {
        const lootCollected:boolean = bag.metadata.getTileData(bag.coordinate,'lootCollected');

        if(lootCollected){
            return false;
        }

        bag.metadata.setTileData(bag.coordinate,'lootCollected',true);
        
        bag.party.sendChannelMessage(this.interactMsg);

        bag.party.game.grantPlayerItem(bag.player.uid,this.item.id,1);

        return true;
    }
}