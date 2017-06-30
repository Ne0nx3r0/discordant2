import EventTile, { EventTileHandlerBag, Coordinate, TileTrap } from '../EventTile';
import ItemId from '../../item/ItemId';
import { IGenerateLootBag } from "../../loot/LootGenerator";
import ItemBase from "../../item/ItemBase";
import ExplorableMap from "../ExplorableMap";
import { WorldMaps } from "../Maps";
import { DamageType } from "../../item/WeaponAttackStep";
import ResistDamage from "../../../util/ResistDamage";

interface IsOpenFunction{
    (bag:EventTileHandlerBag):boolean;
}

//from[index] will teleport to to[index]
interface EventTileDoorBag{
    from: Array<Coordinate>;
    to: Array<Coordinate>;
    chanceTrapped?: number;
    trap?: TileTrap;
    enterMessage?: string;
    interactMessage?: string;
    isOpen?:IsOpenFunction;
}

export class EventTileDoor extends EventTile{
    from: Array<Coordinate>;
    to: Array<Coordinate>;
    chanceTrapped?: number;
    trap?: TileTrap;
    enterMessage?: string;
    interactMessage?: string;
    isOpen?: IsOpenFunction;

    constructor(bag:EventTileDoorBag){
        super({
            stopsPlayer: true,    
        });

        this.from = bag.from;
        this.to = bag.to;
        this.chanceTrapped = bag.chanceTrapped == undefined ? 0 : bag.chanceTrapped;
        this.trap = bag.trap;
        this.enterMessage = bag.enterMessage;
        this.interactMessage = bag.interactMessage;
        this.isOpen = bag.isOpen;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const hasInteracted:boolean = bag.metadata.getTileData(this.from[0],'hasInteracted');

        if(this.enterMessage){
            bag.party.sendCurrentMapImageFile(this.enterMessage);
        }
        else if(this.isOpen && !this.isOpen(bag)){
            bag.party.sendCurrentMapImageFile(`The door is locked (maybe there is a way to unlock it?)`);
        }
        else if(!hasInteracted){
            bag.party.sendCurrentMapImageFile(`A door, it could be trapped. (\`di\` to enter)`);
        }
        else{
            bag.party.sendCurrentMapImageFile(`A door, it looks safe. (\`di\` to enter)`);
        }

        return true;
    }

    onInteract(bag:EventTileHandlerBag):boolean{
        if(this.isOpen && !this.isOpen(bag)){
            bag.party.sendChannelMessage(`The door is locked (maybe there is a way to open it?)`);

            return true;
        }

        const trapResults = [];
        const hasInteracted:boolean = bag.metadata.getTileData(this.from[0],'hasInteracted');

        if(this.trap && !hasInteracted){
            //trap fired
            if(Math.random() < this.chanceTrapped){
                trapResults.push(`${bag.party.leader.title} triggered a trap!`);

                bag.party.members.forEach((member)=>{
                    let damageTaken = ResistDamage(member,this.trap.amount,this.trap.type);

                    if(damageTaken >= member.hpCurrent){
                        damageTaken = member.hpCurrent-1;
                    }

                    const damageResisted = this.trap.amount - damageTaken; 

                    let resistedStr;

                    if(damageResisted > 0){
                        resistedStr = ` resisted ${damageResisted}`;
                    }
                    
                    member.hpCurrent -= damageTaken;

                    trapResults.push(`${member.title} took ${damageTaken} ${DamageType[this.trap.type].toUpperCase()} damage${resistedStr}`);
                });
            }
        }

        let toCoordinate:Coordinate;

        //from[index] links to to[index] and vice versa
        for(var i=0;i<this.from.length;i++){
            var coordinate = this.from[i];
            
            if(coordinate.x == bag.coordinate.x && coordinate.y == bag.coordinate.y){
                toCoordinate = this.to[i];
                break;
            }
        }

        if(!toCoordinate){
            for(var i=0;i<this.to.length;i++){
                var coordinate = this.to[i];
                
                if(coordinate.x == bag.coordinate.x && coordinate.y == bag.coordinate.y){
                    toCoordinate = this.from[i];
                    break;
                }
            }
        }

        if(!toCoordinate) throw `Error with door at map ${bag.party.exploration.map.title} at ${bag.coordinate}, coordinate no defined`;

        bag.party.exploration.moveTo(toCoordinate.x,toCoordinate.y);

        bag.party.sendCurrentMapImageFile([this.interactMessage || `Entered a new room`].concat(trapResults).join('\n'));

        bag.metadata.setTileData(this.from[0],'hasInteracted',true);

        return true;
    }
}