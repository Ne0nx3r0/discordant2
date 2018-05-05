import { EventTileHandlerBag } from "../EventTile";
import {EventTile} from "../EventTile";

interface EventTileEnterMessageBag{
    message:string;
    stopsPlayer?:boolean;
}

export default class EventTileEnterMessage extends EventTile{
    message:string;

    constructor(bag:EventTileEnterMessageBag){
        super({
            stopsPlayer: bag.stopsPlayer == undefined ? false : bag.stopsPlayer,
        });

        this.message = bag.message;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        bag.party.sendCurrentMapImageFile(this.message);

        return true;
    }
}