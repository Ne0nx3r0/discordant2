import IDamageSet from '../../damage/IDamageSet';
import Creature from '../../creature/Creature';
import Weapon from './Weapon';
import PlayerBattle from '../battle/PlayerBattle';

export interface DamageFuncBag{
        attacker:Creature;
        defender:Creature;
        battle:PlayerBattle;
}

interface DamageFunc{
    (     
        bag:DamageFuncBag
    ):IDamageSet;
}

export interface WeaponAttackStepBag{
    attackMessage:string;
    exhaustion:number;
    damageFunc?:DamageFunc;
}

export default class WeaponAttackStep{
    attackMessage:string;
    exhaustion:number;
    getDamages:DamageFunc;

    constructor(bag:WeaponAttackStepBag){
        this.attackMessage = bag.attackMessage;
        this.exhaustion = bag.exhaustion;
        this.getDamages = bag.damageFunc;
    }
}