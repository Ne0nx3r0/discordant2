import Creature from '../creature/Creature';
import WeaponAttackStep from './WeaponAttackStep';

interface AIShouldUseFunc{
    (attacker:Creature):boolean;
}

export interface WeaponAttackBag{
    title:string;
    steps:Array<WeaponAttackStep>;
    aiUseWeight:number;
    aiShouldIUseThisAttack?: AIShouldUseFunc;
}

export default class WeaponAttack{
    title:string;
    steps:Array<WeaponAttackStep>;

    //1-100 weighted chance AI will use this attack
    aiUseWeight:number;

    //is now an appropriate time to use this attack?
    //master is in the case where this is a pet
    aiShouldIUseThisAttack:AIShouldUseFunc;

    constructor(bag:WeaponAttackBag){
        this.title = bag.title;
        this.steps = bag.steps;
        this.aiUseWeight = bag.aiUseWeight;
        this.aiShouldIUseThisAttack = bag.aiShouldIUseThisAttack || function(attacker:Creature){return true};
    }
}