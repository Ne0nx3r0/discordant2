import Creature from '../creature/Creature';
import Weapon from './Weapon';
import WeaponAttack from './WeaponAttack';
import CreatureBattleTurnBased from '../battle/CreatureBattleTurnBased';
import { IBattleCreature } from '../battle/CreatureBattleTurnBased';

export enum DamageType{
    healing,
    physical,
    fire,
    dark,
    thunder,
    chaos,
    special
}

export interface DamageFuncBag{
    attacker:IBattleCreature;
    defender:IBattleCreature;
    battle:CreatureBattleTurnBased;
    step:WeaponAttackStep;
    isCritical:boolean;
}

export interface IWeaponAttackDamages{
    target: IBattleCreature;
    type: DamageType;
    amount: number;
}

interface DamageFunc{
    (     
        bag:DamageFuncBag
    ):Array<IWeaponAttackDamages>;
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