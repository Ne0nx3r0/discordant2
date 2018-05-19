import Weapon from "../../item/Weapon";
import ItemId from "../../item/ItemId";
import WeaponAttack from "../../item/WeaponAttack";
import { AddBonusesEvent, BattleBeginEvent } from "../../item/ItemEquippable";

interface DynamicWeaponBag{
    chanceToCritical?: number;
    criticalMultiplier?: number;
    attacks:WeaponAttack[];    
    onAddBonuses?: (e:AddBonusesEvent)=>void;
    onBattleBegin?: (e:BattleBeginEvent)=>void;
}

export class DynamicPetWeapon extends Weapon{
    constructor(bag:DynamicWeaponBag){
        super({
            id: ItemId.DynamicPetWeapon,
            title: 'Dynamic Pet Weapon',
            description: 'A creature item',
            goldValue: 0,
            damageBlocked: 0,
            useRequirements: {},
            showInItems: false,
            ...bag,
        });
    }
}

