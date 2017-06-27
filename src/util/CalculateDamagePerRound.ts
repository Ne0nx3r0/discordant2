import WeaponAttack from '../core/item/WeaponAttack';

export function CalculateDamagePerRoundDirectly(minDamage:number,maxDamage:number,charges:number,criticalMultiplier:number,criticalChance:number):number{
    return (minDamage+maxDamage) / 2 * (1 + criticalMultiplier * criticalChance )
        / 
        charges;
}

export default function CalculateDamagePerRound(attack:WeaponAttack){
    return CalculateDamagePerRoundDirectly(
        attack.minBaseDamage,
        attack.maxBaseDamage,
        attack.chargesRequired+1,
        attack.weapon.criticalMultiplier,
        attack.weapon.chanceToCritical
    );    
}