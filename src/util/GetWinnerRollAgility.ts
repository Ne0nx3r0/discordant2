import Creature from "../core/creature/Creature";

export function GetWinnerRollAgility(c1:Creature,c2:Creature){
    const c1Roll = c1.stats.agility * Math.random() + c1.stats.agility * Math.random();
    const c2Roll = c2.stats.agility * Math.random() + c2.stats.agility * Math.random();

    return c1Roll > c2Roll ? c1 : c2;
}