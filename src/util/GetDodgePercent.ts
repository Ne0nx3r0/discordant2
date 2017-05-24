const MAX_DODGE = 0.4; // 40%

export function GetDodgePercent(attackerScalingStat:number,defenderAgility:number){
    return Math.min( (defenderAgility-10) / ( 25 + attackerScalingStat * 3 ) ,MAX_DODGE);
}