import ExplorableMap from '../map/ExplorableMap';
import Game from '../../gameserver/game/Game';
import { SendPartyMessageFunc } from '../map/EventTile';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import LootGenerator from "../loot/LootGenerator";
import PlayerParty from "./PlayerParty";
import MapMetaDataCache from "../map/MapMetaDataCache";

type PartyMoveDirection = 'U' | 'L' | 'D' | 'R';

export {PartyMoveDirection}

interface IPartyExploringMapBag{
    map:ExplorableMap;
    party:PlayerParty;
    sendPartyMessage:SendPartyMessageFunc;
}

export default class PartyExploringMap{
    map:ExplorableMap;
    currentX:number;
    currentY:number;
    party:PlayerParty;
    sendPartyMessage:SendPartyMessageFunc;
    metadata: MapMetaDataCache;

    constructor(bag:IPartyExploringMapBag){
        this.map = bag.map;
        this.party = bag.party;

        this.currentX = bag.map.mapData.startX;
        this.currentY = bag.map.mapData.startY;

        this.sendPartyMessage = bag.sendPartyMessage;
        this.metadata = new MapMetaDataCache();
    }

    getCurrentLocationImage(){
        return this.map.getMapSlicePath(this.currentX,this.currentY);
    }

    canMove(direction:PartyMoveDirection){
             if(direction == 'U') return this.map.isWalkable(this.currentX,this.currentY-1);
        else if(direction == 'D') return this.map.isWalkable(this.currentX,this.currentY+1);
        else if(direction == 'L') return this.map.isWalkable(this.currentX-1,this.currentY);
        else if(direction == 'R') return this.map.isWalkable(this.currentX+1,this.currentY);
    }

    moveTo(x:number,y:number){
        this.currentX = x;
        this.currentY = y;
    }

    move(direction:PartyMoveDirection){
             if(direction == 'U') this.currentY -= 1;
        else if(direction == 'D') this.currentY += 1;
        else if(direction == 'L') this.currentX -= 1;
        else if(direction == 'R') this.currentX += 1;
    }

    setLocation(x:number,y:number){
        this.currentX = x;
        this.currentY = y;

        this.onEnterCurrentTile();
    }

    getEncounterChance():number{
        return this.map.getEncounterChance();
    }

    getRandomEncounterMonsterId():number{
        return this.map.getRandomEncounterMonsterId();
    }

    onEnterCurrentTile():boolean{
        const xDashY = this.currentX+'-'+this.currentY;

        const event = this.map.getTileEvent(xDashY);

        if(event){
            return event.onEnter({
                party: this.party,
                player: this.party.leader,
                coordinate: {
                    x: this.currentX,
                    y: this.currentY,
                },
                metadata: this.metadata,
            });
        }

        return false;
    }

    onInteractCurrentTile(player:PlayerCharacter){
        const xDashY = this.currentX+'-'+this.currentY;

        const event = this.map.getTileEvent(xDashY);

        if(event){
            const eventRan = event.onInteract({
                party: this.party,
                player: player,
                coordinate: {
                    x: this.currentX,
                    y: this.currentY,
                },
                metadata: this.metadata,
            });
            
            if(!eventRan){
                this.sendPartyMessage('Nothing of interest here...');
            }
        }
        else{
            this.sendPartyMessage(`There doesn't seem to be anything of interest here`);
        }
    }

    get currentTileStopsPlayer():boolean{
        const xDashY = this.currentX+'-'+this.currentY;

        const event = this.map.getTileEvent(xDashY);

        return event && event.stopsPlayer;
    }
}