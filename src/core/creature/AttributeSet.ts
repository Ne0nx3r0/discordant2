export enum Attribute{
    strength,
    agility,
    vitality,
    spirit,
    charisma,
    luck
}

export interface AttributeBag{
    strength:number;
    agility:number;
    vitality:number;
    spirit:number;
    charisma:number;
    luck:number;
}

export default class AttributeSet{
    strength:number;
    agility:number;
    vitality:number;
    spirit:number;
    charisma:number;
    luck:number;

    constructor(bag:AttributeBag){
        this.strength = bag.strength || 0;//requierd to use heavy weapons, increases cold resistance
        this.agility = bag.agility || 0;//required to use light weapons, increases fire resistance
        this.vitality = bag.vitality || 0;// increases hp
        this.spirit = bag.spirit || 0;// required to use legends, increases legend damage
        this.charisma = bag.charisma || 0;//increases pet damage
        this.luck = bag.luck || 0; // better item finds, chance for criticals, increases thunder resistance
    }
}