import IDamageSet from '../damage/IDamageSet';
import Creature from '../creature/Creature';
import Weapon from './Weapon';
import WeaponAttack from './WeaponAttack';
import CreatureBattleTurnBased from '../battle/CreatureBattleTurnBased';
import { IBattleCreature } from '../battle/CreatureBattleTurnBased';

export interface DamageFuncBag{
    attacker:IBattleCreature;
    defender:IBattleCreature;
    battle:CreatureBattleTurnBased;
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