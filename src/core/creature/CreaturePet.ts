import CreatureAIControlled, { CreatureAIBag } from "./CreatureAIControlled";
import PlayerCharacter from "./player/PlayerCharacter";

export class CreaturePet extends CreatureAIControlled{
    dbId: string;
    owner: PlayerCharacter;    
}