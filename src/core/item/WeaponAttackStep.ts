import IDamageSet from '../damage/IDamageSet';
import Creature from '../creature/Creature';
import Weapon from './Weapon';
import WeaponAttack from './WeaponAttack';
import { IBattleCreature } from '../battle/CreatureBattle';
import CreatureBattle from '../battle/CreatureBattle';

export interface DamageFuncBag{
    attacker:IBattleCreature;
    defender:IBattleCreature;
    battle:CreatureBattle;
    step:WeaponAttackStep;
    isCritical:boolean;
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