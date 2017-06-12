import EventTile, { EventTileHandlerBag, Coordinate, TileTrap } from '../EventTile';
import ItemId from '../../item/ItemId';
import { IGenerateLootBag } from "../../loot/LootGenerator";
import ItemBase from "../../item/ItemBase";
import ExplorableMap from "../ExplorableMap";
import { WorldMaps } from "../Maps";
import { DamageType } from "../../item/WeaponAttackStep";
import ResistDamage from "../../../util/ResistDamage";

//from[index] will teleport to to[index]
interface EventTileDoorBag{
    from: Array<Coordinate>;
    to: Array<Coordinate>;
    chanceTrapped: number;
    trap: TileTrap;
}

export class EventTileDoor extends EventTile{
    from: Array<Coordinate>;
    to: Array<Coordinate>;
    chanceTrapped: number;
    trap: TileTrap;

    constructor(bag:EventTileDoorBag){
        super({
            stopsPlayer: true,    
        });

        this.from = bag.from;
        this.to = bag.to;
        this.chanceTrapped = bag.chanceTrapped;
        this.trap = bag.trap;
    }

    onEnter(bag:EventTileHandlerBag):boolean{
        const hasInteracted:boolean = bag.metadata.getTileData(bag.coordinate,'hasInteracted');

        if(!hasInteracted){
            bag.party.sendCurrentMapImageFile(`A doorway... It could be trapped.`);
        }
        else{
            bag.party.sendCurrentMapImageFile(`A doorway`);
        }

        return true;
    }

    onInteract(bag:EventTileHandlerBag):boolean{
        const trapResults = [];
        const hasInteracted:boolean = bag.metadata.getTileData(bag.coordinate,'hasInteracted');

        if(this.trap && !hasInteracted){
            //trap fired
            if(Math.random() < this.chanceTrapped){
                trapResults.push(`${bag.party.leader.title} triggered a trap!`);

                bag.party.members.forEach((member)=>{
                    const damageTaken = ResistDamage(member,this.trap.amount,this.trap.type);
                    const damageResisted = this.trap.amount - damageTaken; 

                    let resistedStr;

                    if(damageResisted > 0){
                        resistedStr = ` resisted ${damageResisted}`;
                    }

                    trapResults.push(`${member.title} took ${damageTaken} ${DamageType[this.trap.type].toUpperCase()} damage${resistedStr}`);
                });
            }
        }

        let toCoordinate:Coordinate;

        for(var i=0;i<this.from.length;i++){
            var coordinate = this.from[i];
            
            if(coordinate.x == bag.coordinate.x && coordinate.y == bag.coordinate.y){
                toCoordinate = coordinate;
                break;
            }
        }

        bag.party.exploration.moveTo(toCoordinate.x,toCoordinate.y);

        bag.party.sendCurrentMapImageFile([`Entered a new room`].concat(trapResults).join('\n'));

        bag.metadata.setTileData(bag.coordinate,'hasInteracted',true);

        return true;
    }
}