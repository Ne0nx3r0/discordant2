import Creature from './Creature';
import * as CreaturesIndex from './CreaturesIndex';
import CreatureAIControlled from './CreatureAIControlled';
import { CreaturePet } from './CreaturePet';
import PlayerCharacter from './player/PlayerCharacter';
import { DBPlayerPet } from '../../gameserver/db/DBInterfaces';

export interface PlayerPetBag{
    owner: PlayerCharacter;
    dbPet: DBPlayerPet;
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
        const dbPet = bag.dbPet;
        const petClass = this.creatures.get(dbPet.base_id);

        if(!petClass){
            throw 'Invalid creature ID: '+dbPet.base_id;
        }

        const pet = new petClass();

        if(!(pet instanceof CreaturePet)){
            throw `Creature ID ${dbPet.base_id} is not a pet`;
        }

        pet.owner = bag.owner;
        pet.dbId = dbPet.id;
        pet.customName = dbPet.title;

        return pet;
    }
}