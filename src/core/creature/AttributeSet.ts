export interface AttributeBag{
    strength:number;
    agility:number;
    vitality:number;
    spirit:number;
    charisma:number;
    luck:number;
}

export default class AttributeSet{
    Strength:number;
    Agility:number;
    Vitality:number;
    Spirit:number;
    Charisma:number;
    Luck:number;

    constructor(bag:AttributeBag){
        this.Strength = bag.strength || 0;//requierd to use heavy weapons, increases cold resistance
        this.Agility = bag.agility || 0;//required to use light weapons, increases fire resistance
        this.Vitality = bag.vitality || 0;// increases hp
        this.Spirit = bag.spirit || 0;// required to use legends, increases legend damage
        this.Charisma = bag.charisma || 0;//increases pet damage
        this.Luck = bag.luck || 0; // better item finds, chance for criticals, increases thunder resistance
    }
}