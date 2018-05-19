import CreatureAIControlled, { CreatureAIBag } from "./CreatureAIControlled";
import PlayerCharacter from "./player/PlayerCharacter";

export class CreaturePet extends CreatureAIControlled{
    customName: string;
    dbId: string;
    owner: PlayerCharacter;    

    getDisplayName(){
        if(this.customName){
            return `${this.customName} (${this.title})`;
        }
        return this.title;
    }
}