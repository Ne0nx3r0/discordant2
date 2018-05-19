import WeaponAttack, { WeaponAttackBag } from "../../item/WeaponAttack";
import { PetAttackId } from "./PetAttackId";

export interface PetWeaponAttackBag extends WeaponAttackBag{
    id: PetAttackId;
}

export class PetWeaponAttack extends WeaponAttack{
    id: PetAttackId;

    constructor(bag:PetWeaponAttackBag){
        super(bag);

        this.id = bag.id;
    }
}