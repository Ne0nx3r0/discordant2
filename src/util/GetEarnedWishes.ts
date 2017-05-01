import { XPToLevel } from "./XPToLevel";

const PARTY_PENALTY = 0.15;

interface WishesBag{
    baseWishes:number;
    partySize:number;
    highestLevel:number;
    playerLevel:number;
}

export default function GetEarnedWishes(bag:WishesBag){
    // Calculate the party penalty
    // 1 party member is no penalty, over that PARTY_PENALTY% is lost per member
    const partyPenalty = 1 - (bag.partySize-1) * PARTY_PENALTY;

    // Adjust base wishes
    const adjustedWishes = bag.baseWishes * partyPenalty;

    //If player is within 5 levels of the top player skip level difference penalty
    if(bag.highestLevel - bag.playerLevel <= 5){
        return Math.round(adjustedWishes);
    }

    // Apply a penalty to players who are five levels below the highest player
    // Instead of earning full adjustedWishes they earn the same % of XP to level as the highest player

    // Calculate what percent to level the highest level player is getting
    const wishesPercent = adjustedWishes / XPToLevel[bag.highestLevel];

    //Adjust base wishes to match the highest level player's percent
    const levelAdjustedWishes = XPToLevel[bag.playerLevel] * wishesPercent;

    //Minimum of 1, rounded
    return Math.max(1,Math.round(levelAdjustedWishes));
}