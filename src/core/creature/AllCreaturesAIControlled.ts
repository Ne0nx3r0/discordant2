import Creature from './Creature';
import * as CreaturesIndex from './CreaturesIndex';
import CreatureAIControlled from './CreatureAIControlled';
import { CreaturePet } from './CreaturePet';

export interface PlayerPetBag{
    creatureId: number;
}

export default class AllCreaturesAIControlled{
    creatures:Map<number,any>;//a bit hacky, but we need to create instances of these

    constructor(){
        this.creatures = new Map();

        Object.keys(CreaturesIndex).forEach((creatureKey)=>{
            const creatureClass = CreaturesIndex[creatureKey];

            const creatureTemp:CreatureAIControlled = new creatureClass();

            this.creatures.set(creatureTemp.id,creatureClass);
        });
    }

    createMonster(id:number):CreatureAIControlled{
        const creatureClass = this.creatures.get(id);

        if(!creatureClass){
            throw 'Invalid creature ID: '+id;
        }

        return new creatureClass();
    }

    createPlayerPet(bag:PlayerPetBag):CreaturePet{
        const petClass = this.creatures.get(bag.creatureId);

        if(!petClass){
            throw 'Invalid creature ID: '+bag.creatureId;
        }

        const pet = new petClass();

        if(!(pet instanceof CreaturePet)){
            throw `Creature ID ${bag.creatureId} is not a pet`;
        }

        return pet;
    }
}