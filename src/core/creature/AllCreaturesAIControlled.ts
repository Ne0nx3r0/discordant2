import Creature from './Creature';
import * as CreaturesIndex from './CreaturesIndex';
import CreatureAIControlled from './CreatureAIControlled';

export default class AllCreaturesAIControlled{
    creatures:Map<number,any>;//a bit hacky, but we need to create instances of these

    constructor(){
        this.creatures = new Map();

        Object.keys(CreaturesIndex).forEach((creatureKey)=>{
            const creatureClass = CreaturesIndex[creatureKey];

            const creatureTemp:CreatureAIControlled = new creatureClass();

            this.creatures.set(creatureTemp.id,creatureClass);
        });
    }

    create(id:number):CreatureAIControlled{
        const creatureClass = this.creatures.get(id);

        if(!creatureClass){
            throw 'Invalid creature ID: '+id;
        }

        return new creatureClass();
    }
}