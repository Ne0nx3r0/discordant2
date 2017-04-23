import IDamageSet from '../damage/IDamageSet';
import Creature from '../creature/Creature';
import Weapon from './Weapon';
import PlayerBattle from "../battle/PlayerBattle";
//import PlayerBattle from '../battle/PlayerBattle';
import WeaponAttack from './WeaponAttack';
import { IBattlePlayerCharacter } from '../battle/PlayerBattle';

export interface DamageFuncBag{
    attacker:Creature;
    defender:Creature;
    battle:PlayerBattle;
    step: WeaponAttackStep;
}

interface DamageFunc{
    (     
        bag:DamageFuncBag
    ):IDamageSet;
}

export interface WeaponAttackStepBag{
    attackMessage:string;
    damageFunc:DamageFunc;
}

export default class WeaponAttackStep{
    attackMessage:string;
    getDamages:DamageFunc;
    attack:WeaponAttack;//set by weaponattack this step instance is added to

    constructor(bag:WeaponAttackStepBag){
        this.attackMessage = bag.attackMessage;
        this.getDamages = bag.damageFunc;
    }
}