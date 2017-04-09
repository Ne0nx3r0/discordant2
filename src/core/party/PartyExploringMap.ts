import ExplorableMap from '../map/ExplorableMap';

type PartyMoveDirection = 'U' | 'L' | 'D' | 'R';

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
}