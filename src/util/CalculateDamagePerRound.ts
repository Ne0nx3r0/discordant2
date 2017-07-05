import WeaponAttack from '../core/item/WeaponAttack';

export function CalculateDamagePerRoundDirectly(minDamage:number,maxDamage:number,chargesRequired:number,criticalMultiplier:number,criticalChance:number):number{
    const exactDPR = ((minDamage+maxDamage)/2)/(chargesRequired+1)*((1-criticalChance)+criticalMultiplier*criticalChance);

    //Round to two decimal points
    return Math.round(exactDPR * 100) / 100;
}

export default function CalculateDamagePerRound(attack:WeaponAttack){
    return CalculateDamagePerRoundDirectly(
        attack.minBaseDamage,
        attack.maxBaseDamage,
        attack.chargesRequired,
        attack.weapon.criticalMultiplier,
        attack.weapon.chanceToCritical
    );    
}