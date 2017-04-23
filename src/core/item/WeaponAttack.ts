import Creature from '../creature/Creature';
import WeaponAttackStep from './WeaponAttackStep';
import { Attribute } from '../creature/AttributeSet';
import Weapon from "./Weapon";

export type WeaponDamageType = 'physical' | 'thunder' | 'fire' | 'cold' | 'chaos' | 'special';

export enum ScalingLevel{
    S,
    A,
    B,
    C,
    D,
    No
}

interface AIShouldUseFunc{
    (attacker:Creature):boolean;
}

export interface WeaponAttackBag{
    title:string;
    specialDescription?: string;
    minBaseDamage: number;
    maxBaseDamage: number;
    damageType: WeaponDamageType;
    scalingAttribute: Attribute;
    scalingLevel: ScalingLevel;
    chargesRequired?: number;
    exhaustion: number;
    steps:Array<WeaponAttackStep>;
    aiUseWeight:number;
    aiShouldIUseThisAttack?: AIShouldUseFunc;
}

export default class WeaponAttack{
    title:string;
    steps:Array<WeaponAttackStep>;

    //Rounds the attack will exhaust for
    exhaustion: number;

    //1-100 weighted chance AI will use this attack
    aiUseWeight:number;

    //is now an appropriate time to use this attack?
    //master is in the case where this is a pet
    aiShouldIUseThisAttack:AIShouldUseFunc;

    specialDescription: string;
    damageType: WeaponDamageType;
    scalingAttribute: Attribute;
    scalingLevel: ScalingLevel;
    minBaseDamage: number;
    maxBaseDamage: number;
    chargesRequired: number;
    weapon: Weapon;//set by weapon this instance is passed to

    constructor(bag:WeaponAttackBag){
        this.title = bag.title;
        this.specialDescription = bag.specialDescription;
        this.minBaseDamage = bag.minBaseDamage;
        this.maxBaseDamage = bag.maxBaseDamage;
        this.damageType = bag.damageType;
        this.scalingAttribute = bag.scalingAttribute;
        this.scalingLevel = bag.scalingLevel;
        this.exhaustion = bag.exhaustion;
        this.chargesRequired = bag.chargesRequired || 0;
        this.steps = bag.steps;
        this.steps.forEach((step)=>{
            step.attack = this;
        });
        this.aiUseWeight = bag.aiUseWeight;
        this.aiShouldIUseThisAttack = bag.aiShouldIUseThisAttack || function(attacker:Creature){return true};
    }

    get rounds(){
        return this.steps.length;
    }
}