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
        this.Strength = bag.strength;//requierd to use heavy weapons, increases cold resistance
        this.Agility = bag.agility;//required to use light weapons, increases fire resistance
        this.Vitality = bag.vitality;// increases hp
        this.Spirit = bag.spirit;// required to use legends, increases legend damage
        this.Charisma = bag.charisma;//increases pet damage
        this.Luck = bag.luck; // better item finds, chance for criticals, increases thunder resistance
    }
}