const MAX_DODGE = 0.5; // 50%

export function GetDodgePercent(attackerScalingStat:number,defenderAgility:number){
    return Math.min( (defenderAgility-10) / ( 25 + attackerScalingStat * 3 ) ,MAX_DODGE);
}