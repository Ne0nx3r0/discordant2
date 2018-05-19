import Creature from './Creature';
import * as CreaturesIndex from './CreaturesIndex';
import CreatureAIControlled from './CreatureAIControlled';
import { CreaturePet } from './CreaturePet';
import PlayerCharacter from './player/PlayerCharacter';
import { DBPlayerPet } from '../../gameserver/db/DBInterfaces';
import { PetWeaponAttack } from '../pets/petattacks/PetWeaponAttack';
import { AllPetAttacks } from '../pets/petattacks/AllPetAttacks';
import { DynamicPetWeapon } from '../pets/petattacks/DynamicPetWeapon';

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

        const attacks = getAttacks([
            dbPet.attack1,
            dbPet.attack2,
            dbPet.attack3,
            dbPet.attack4,
        ]);

        // Create a weapon to be the host for the attacks
        // Important for things like critical rate
        const petWeapon = new DynamicPetWeapon({
            attacks,
        });

        // Attach any onbattlebegin events from the pet
        petWeapon.onBattleBegin = pet.onBattleBegin;

        // Attach the dynamic pet attacks
        pet.attacks = attacks;

        return pet;
    }
}

function getAttacks(attackIds:number[]):PetWeaponAttack[]{
    return attackIds
    .filter((id)=>{
        return typeof id === "number";
    })
    .map((id):PetWeaponAttack=>{
        return AllPetAttacks.getAttack(id);
    });
}