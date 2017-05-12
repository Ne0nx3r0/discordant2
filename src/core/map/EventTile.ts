import PlayerCharacter from '../creature/player/PlayerCharacter';
import Game from '../../gameserver/game/Game';
import LootGenerator from "../loot/LootGenerator";
import PlayerParty from "../party/PlayerParty";

export interface SendPartyMessageFunc{
    (msg:string):void;
}

export interface EventTileHandlerBag{
    runCount: number;//number of times the event has fired for this tile on this adventure (starts with 0)
    sendPartyMessage: SendPartyMessageFunc;
    party: PlayerParty;
}

export interface EventTileInteractBag extends EventTileHandlerBag{
    player: PlayerCharacter;
}

interface EventTileHandlerFunc{
    (bag:EventTileHandlerBag):void;
}

interface EventTileInteractHandlerFunc{
    (bag:EventTileInteractBag):boolean;
}

export interface EventTileBag{
    onEnter?:EventTileHandlerFunc;
    onExit?:EventTileHandlerFunc;
    onInteract?:EventTileInteractHandlerFunc;
}

export default class EventTile{
    onEnter:EventTileHandlerFunc;
    onExit:EventTileHandlerFunc;
    onInteract:EventTileInteractHandlerFunc;

    constructor(bag:EventTileBag){
        this.onEnter = bag.onEnter;
        this.onExit = bag.onExit;
        this.onInteract = bag.onInteract;
    }
}