import CreatureAIControlled, { CreatureAIBag } from "./CreatureAIControlled";
import PlayerCharacter from "./player/PlayerCharacter";

export class CreaturePet extends CreatureAIControlled{
    owner: PlayerCharacter; 

    setOwner(owner:PlayerCharacter){
        this.owner = owner;
    }   
}