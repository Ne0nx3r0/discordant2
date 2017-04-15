import CreatureAIControlled from '../core/creature/CreatureAIControlled';

import PartyExplore from '../bot/commands/PartyExplore';
import { IBattlePlayerCharacter } from '../core/battle/PlayerBattle';
import Creature from '../core/creature/Creature';
import PlayerBattle from '../core/battle/PlayerBattle';
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
    const partyPenalty = 1 - (bag.partySize-1) * PARTY_PENALTY;

    // Adjust base wishes
    const adjustedWishes = bag.baseWishes * partyPenalty;

    // Calculate what percent to level the highest level player is getting
    const wishesPercent = adjustedWishes / XPToLevel[bag.highestLevel];

    //Adjust base wishes to match the highest level player's percent
    const levelAdjustedWishes = XPToLevel[bag.playerLevel] * wishesPercent;

    return Math.max(1,Math.round(levelAdjustedWishes));
}