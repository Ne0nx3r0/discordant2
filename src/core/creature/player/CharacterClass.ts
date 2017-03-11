import AttributeSet from '../AttributeSet';
import CreatureEquipment from '../../item/CreatureEquipment';

export default class CharacterClass {
    id:number;
    title:string;
    description:string;
    startingAttributes:AttributeSet;
    startingEquipment:CreatureEquipment;

    constructor(id:number,title:string,description:string,startingAttributes:AttributeSet,startingEquipment?:CreatureEquipment){
        this.id = id;
        this.title = title;
        this.description = description;
        this.startingAttributes = startingAttributes;
        this.startingEquipment = startingEquipment || new CreatureEquipment({});
    }
}