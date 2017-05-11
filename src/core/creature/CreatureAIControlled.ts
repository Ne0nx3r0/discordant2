import Creature from './Creature';
import { CreatureBag } from './Creature'; 
import WeaponAttack from '../item/WeaponAttack';
import WeaponAttackStep from '../item/WeaponAttackStep';
import PlayerCharacter from './player/PlayerCharacter';

interface CreatureAIBag extends CreatureBag{
    wishesDropped:number;
}

export default class CreatureAIControlled extends Creature{
    wishesDropped:number;
    attacks:Array<WeaponAttack>;
    
    constructor(bag:CreatureAIBag){
        super(bag);
        
        this.wishesDropped = bag.wishesDropped;

        this.attacks = [];

        if(bag.equipment.weapon){
            this.attacks = this.attacks.concat(bag.equipment.weapon.attacks);
        }
        if(bag.equipment.offhand){
            this.attacks = this.attacks.concat(bag.equipment.offhand.attacks);
        }
    }

    //May return nothing if no valid attacks or if no attacks that should be used right now
    getRandomAttack(){
        //determine which attacks we can use right now and create a weighted pool
        const availableAttacks:Array<WeaponAttack> = [];
        let attacksWeightTotal = 0;

        this.attacks.forEach((attack)=>{
            if(attack.aiShouldIUseThisAttack(this)){
                availableAttacks.push(attack);

                attacksWeightTotal += attack.aiUseWeight;
            }
        });

        //choose an attack from the pool
        const roll = Math.random() * attacksWeightTotal;
        let currentWeight = 0;

        for(var i=0;i<availableAttacks.length;i++){
            const attack = availableAttacks[i];

            currentWeight += attack.aiUseWeight;

            if(roll < currentWeight){
                return attack;
            }
        }
    }
}