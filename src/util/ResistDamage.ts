import Creature from "../core/creature/Creature";
import { DamageType } from "../core/item/WeaponAttackStep";

export function GetDamageResisted(creature:Creature,amount:number,type:DamageType):number{    
    const damageTypeStr = DamageType[type];
    
    const resistance = creature.stats.resistances[damageTypeStr];
    
    let damageTaken = amount - resistance;
    let minDamage = amount * 0.2;

    if(damageTaken < minDamage){
        damageTaken = minDamage;
    }

    return Math.round(amount - damageTaken);
}

export function GetDamageBlocked(creature:Creature,amount:number):number{
    const weaponBlock = 0 + (creature.equipment.weapon && creature.equipment.weapon.damageBlocked);
    const offhandBlock = 0 + (creature.equipment.offhand && creature.equipment.offhand.damageBlocked);
    
    const totalBlock = weaponBlock + offhandBlock;
    
    return Math.round( amount * ( 1 - totalBlock ) );
}