import PlayerCharacter from '../creature/player/PlayerCharacter';
import Game from '../../gameserver/game/Game';
import LootGenerator from "../loot/LootGenerator";
import PlayerParty from "../party/PlayerParty";
import { DamageType } from "../item/WeaponAttackStep";
import MapMetaDataCache from "./MapMetaDataCache";

export interface Coordinate{
    x: number;
    y: number;
}

export interface TileTrap{
    amount: number;
    type: DamageType;
}

export interface SendPartyMessageFunc{
    (msg:string):void;
}

export interface EventTileHandlerBag{
    party: PlayerParty;
    player: PlayerCharacter;
    coordinate: Coordinate;
    metadata: MapMetaDataCache;
}

interface EventTileHandlerFunc{
    (bag:EventTileHandlerBag):void;
}

export interface EventTileBag{
    stopsPlayer?: boolean;
}

export default class EventTile{
    stopsPlayer: boolean;
    
    constructor(bag:EventTileBag){
        this.stopsPlayer = bag.stopsPlayer != undefined ? bag.stopsPlayer : true;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        return false;
    }

    onInteract(bag:EventTileHandlerBag):boolean{
        return false;
    }
}