import CreatureAIControlled, { CreatureAIBag } from "./CreatureAIControlled";
import PlayerCharacter from "./player/PlayerCharacter";
import { BattleBeginEvent } from "../item/ItemEquippable";

interface CreaturePetBag extends CreatureAIBag{
    onBattleBegin?: (e:BattleBeginEvent)=>void;
}

export class CreaturePet extends CreatureAIControlled{
    customName: string;
    dbId: string;
    owner: PlayerCharacter;
    onBattleBegin?: (e:BattleBeginEvent)=>void;

    constructor(bag:CreaturePetBag){
        super(bag);

        if(bag.onBattleBegin){
            this.onBattleBegin = bag.onBattleBegin;
        }
    }

    getDisplayName(){
        if(this.customName){
            return `${this.customName} (${this.title})`;
        }
        return this.title;
    }
}