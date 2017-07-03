const MAX_DODGE = 0.30;//%

export function GetDodgePercentRaw(attackerAccuracy:number,chargesUsed:number,defenderDodge:number){
    return GetDodgePercent(attackerAccuracy-10,chargesUsed,defenderDodge);
}

export function GetDodgePercent(attackerAccuracy:number,chargesUsed:number,defenderDodge:number){
    console.log(attackerAccuracy+' - '+chargesUsed + ' - '+defenderDodge, defenderDodge / ( attackerAccuracy * 8 * ((chargesUsed+1)/4) ) );
    return Math.min( defenderDodge / ( attackerAccuracy * 8 * (chargesUsed/4) ), MAX_DODGE);
}