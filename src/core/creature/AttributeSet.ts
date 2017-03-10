export default class AttributeSet{
    Strength:number;
    Agility:number;
    Vitality:number;
    Spirit:number;
    Charisma:number;
    Luck:number;

    constructor(str:number,agl:number,vit:number,spr:number,cha:number,lck:number){
        this.Strength = str;//requierd to use heavy weapons, increases cold resistance
        this.Agility = agl;//required to use light weapons, increases fire resistance
        this.Vitality = vit;// increases hp
        this.Spirit = spr;// required to use legends, increases legend damage
        this.Charisma = cha;//increases pet damage
        this.Luck = lck; // better item finds, chance for criticals, increases thunder resistance
    }
}