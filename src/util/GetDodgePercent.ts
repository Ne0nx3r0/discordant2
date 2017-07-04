const MAX_DODGE = 0.30;//%

export function GetDodgePercent(attackerAccuracy:number,chargesUsed:number,defenderDodge:number){
    if(defenderDodge <= 0){
        return 0;
    }

    return Math.min( 
        defenderDodge / ( attackerAccuracy * 8 * ((chargesUsed+1)/4) ), 
        MAX_DODGE
    );
}