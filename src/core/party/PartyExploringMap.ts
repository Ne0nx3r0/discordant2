import ExplorableMap from '../map/ExplorableMap';
import Game from '../../gameserver/game/Game';
import { SendPartyMessageFunc } from '../map/EventTile';

type PartyMoveDirection = 'U' | 'L' | 'D' | 'R';

export {PartyMoveDirection}

export default class PartyExploringMap{
    map:ExplorableMap;
    currentX:number;
    currentY:number;
    game: Game;
    sendPartyMessage:SendPartyMessageFunc;
    onEnterRunCounts:Map<string,number>;
    onExitRunCounts:Map<string,number>;
    onInteractRunCounts:Map<string,number>;

    constructor(map:ExplorableMap,game:Game,sendPartyMessage:SendPartyMessageFunc,startX:number,startY:number){
        this.map = map;

        this.currentX = startX;
        this.currentY = startY;

        this.game = game;
        this.sendPartyMessage = sendPartyMessage;

        this.onEnterRunCounts = new Map();
        this.onExitRunCounts = new Map();
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

    move(direction:PartyMoveDirection){
             if(direction == 'U') this.currentY -= 1;
        else if(direction == 'D') this.currentY += 1;
        else if(direction == 'L') this.currentX -= 1;
        else if(direction == 'R') this.currentX += 1;
    }

    getEncounterChance():number{
        return this.map.getEncounterChance();
    }

    getRandomEncounterMonsterId():number{
        return this.map.getRandomEncounterMonsterId();
    }

    onEnterCurrentTile(){
        const xDashY = this.currentX+'-'+this.currentY;

        const event = this.map.getTileEvent(xDashY);

        const runCounts = this.onEnterRunCounts.get(xDashY) || 0;

        if(event && event.onEnter){
            event.onEnter({
                runCount: runCounts,
                sendPartyMessage: this.sendPartyMessage,
                game: this.game,
            });

            this.onEnterRunCounts.set(xDashY,runCounts+1);
        }
    }
}