import ExplorableMap from '../map/ExplorableMap';
import Game from '../../gameserver/game/Game';
import { SendPartyMessageFunc } from '../map/EventTile';
import PlayerCharacter from '../creature/player/PlayerCharacter';
import LootGenerator from "../loot/LootGenerator";
import PlayerParty from "./PlayerParty";

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
    onEnterRunCounts:Map<string,number>;
    onInteractRunCounts:Map<string,number>;
    
    constructor(bag:IPartyExploringMapBag){
        this.map = bag.map;
        this.party = bag.party;

        this.currentX = bag.map.mapData.startX;
        this.currentY = bag.map.mapData.startY;

        this.sendPartyMessage = bag.sendPartyMessage;

        this.onEnterRunCounts = new Map();
        this.onInteractRunCounts = new Map();
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

        const runCounts = this.onEnterRunCounts.get(xDashY) || 0;

        if(event && event.onEnter){
            event.onEnter({
                runCount: runCounts,
                sendPartyMessage: this.sendPartyMessage,
                party: this.party,
            });

            this.onEnterRunCounts.set(xDashY,runCounts+1);

            return true;
        }

        return false;
    }

    onInteractCurrentTile(player:PlayerCharacter){
        const xDashY = this.currentX+'-'+this.currentY;

        const event = this.map.getTileEvent(xDashY);

        const runCounts = this.onInteractRunCounts.get(xDashY) || 0;

        if(event && event.onInteract){
            if(!event.onInteract({
                runCount: runCounts,
                sendPartyMessage: this.sendPartyMessage,
                party: this.party,
                player: player,
            })){
                this.sendPartyMessage('Nothing of interest here...');
            }

            this.onInteractRunCounts.set(xDashY,runCounts+1);
        }
        else{
            this.sendPartyMessage(`There doesn't seem to be anything of interest here`);
        }
    }
}