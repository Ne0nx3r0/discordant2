const MAX_XP_BONUS = 0.5;//%

export function GetLuckXPBonus(luck:number){
    const rawBonus = Math.floor(luck / 10) * 0.01;

    return Math.min(rawBonus,MAX_XP_BONUS);
}