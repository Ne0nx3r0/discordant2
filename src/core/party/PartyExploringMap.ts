import ExplorableMap from '../map/ExplorableMap';

type PartyMoveDirection = 'up' | 'left' | 'down' | 'right';

export {PartyMoveDirection}

export default class PartyExploringMap{
    map:ExplorableMap;
    currentX:number;
    currentY:number;

    constructor(map:ExplorableMap){
        this.map = map;

        const startingPoint = map.getStartingPoint();

        this.currentX = startingPoint.x;
        this.currentY = startingPoint.y;
    }

    getCurrentLocationImage(){
        return this.map.getMapSlicePath(this.currentX,this.currentY);
    }

    canMove(direction:PartyMoveDirection){
                if(direction == 'up') return this.map.isWalkable(this.currentX,this.currentY-1);
         else if(direction == 'down') return this.map.isWalkable(this.currentX,this.currentY+1);
         else if(direction == 'left') return this.map.isWalkable(this.currentX-1,this.currentY);
        else if(direction == 'right') return this.map.isWalkable(this.currentX+1,this.currentY);
    }

    move(direction:PartyMoveDirection){
        if(direction == 'up') this.currentY -= 1;
        else if(direction == 'down') this.currentY += 1;
        else if(direction == 'left') this.currentX -= 1;
        else if(direction == 'right') this.currentX += 1;
    }

    getEncounterChance():number{
        return this.map.getEncounterChance();
    }

    getRandomEncounterMonsterId():number{
        return this.map.getRandomEncounterMonsterId();
    }
}