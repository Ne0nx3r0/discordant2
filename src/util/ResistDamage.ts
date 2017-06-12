import Creature from "../core/creature/Creature";
import { DamageType } from "../core/item/WeaponAttackStep";

export default function ResistDamage(creature:Creature,amount:number,type:DamageType):number{    
    const damageTypeStr = DamageType[type];
    
    const resistance = creature.stats.resistances[damageTypeStr];
    
    let damageTaken = amount - resistance;
    let minDamage = amount * 0.2;

    if(damageTaken < minDamage){
        damageTaken = minDamage;
    }

    return Math.round(damageTaken);
}