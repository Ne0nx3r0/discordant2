import { PetPersonalityId } from "./PetPersonalityId";

interface PetPersonalityBag{
    id: PetPersonalityId;
}

class PetPersonality{
    id: PetPersonalityId;
    
    constructor(bag:PetPersonalityBag){
        this.id = bag.id;
    }
}