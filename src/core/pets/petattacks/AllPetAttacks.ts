import {Slash} from './attacks/Slash';
import {Heal} from './attacks/Heal';
import { PetWeaponAttack } from './PetWeaponAttack';

const AttacksIdLookup:Map<number,PetWeaponAttack> = new Map();

[
    Slash,
    Heal,
].forEach((petAttack:PetWeaponAttack)=>{
    AttacksIdLookup.set(petAttack.id,petAttack);
});

export const AllPetAttacks = {
    getAttack: (id:number):PetWeaponAttack => {
        return AttacksIdLookup.get(id);
    },

    getAllAttacks: ():IterableIterator<PetWeaponAttack> => {
        return AttacksIdLookup.values();
    },
};