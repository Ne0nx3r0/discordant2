export interface EventTileHandlerBag{
    runCount: number;//number of times the event has fired for this tile on this adventure (starts with 0)
    sendPartyMessage(msg:string):void;
}

interface EventTileHandlerFunc{
    (bag:EventTileHandlerBag):boolean;
}

export interface EventTileBag{
    x: number;
    y: number;
    onScry?:EventTileHandlerFunc;
    onScavenge?:EventTileHandlerFunc;
    onForage?:EventTileHandlerFunc;
    onEnter?:EventTileHandlerFunc;
    onExit?:EventTileHandlerFunc;
    onInteract?:EventTileHandlerFunc;
}

function defaultHandler(){
    return false;
}

export default class EventTile{
    x: number;
    y: number;
    onScry:EventTileHandlerFunc;
    onScavenge:EventTileHandlerFunc;
    onForage:EventTileHandlerFunc;
    onEnter:EventTileHandlerFunc;
    onExit:EventTileHandlerFunc;
    onInteract:EventTileHandlerFunc;

    constructor(bag:EventTileBag){
        this.x = bag.x;
        this.y = bag.y;
        this.onScry = bag.onScry || defaultHandler;
        this.onScavenge = bag.onScavenge || defaultHandler;
        this.onForage = bag.onForage || defaultHandler;
        this.onEnter = bag.onEnter || defaultHandler;
        this.onExit = bag.onExit || defaultHandler;
        this.onInteract = bag.onInteract || defaultHandler;
    }
}