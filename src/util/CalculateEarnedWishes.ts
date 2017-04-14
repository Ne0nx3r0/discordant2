import CreatureAIControlled from '../core/creature/CreatureAIControlled';

import PartyExplore from '../bot/commands/PartyExplore';
import { IBattlePlayerCharacter } from '../core/battle/PlayerBattle';
import Creature from '../core/creature/Creature';

const PARTY_PENALTY = 0.02;
const LEVEL_PENALTY = 0.03;

export default function CalculateEarnedWishes(bpcs:Map<Creature, IBattlePlayerCharacter>,opponent:CreatureAIControlled){
    const baseWishes = opponent.wishesDropped;
    const partySize = bpcs.size;

    let partyLevel = 0;
    
    bpcs.forEach(function(bpc){
        if(partyLevel < bpc.pc.level){
            partyLevel = bpc.pc.level;
        }
    });

    const partyModifier = 1- (partySize-1) * PARTY_PENALTY;
    const levelModifier = 1 - LEVEL_PENALTY * partyLevel + LEVEL_PENALTY;

    return baseWishes * levelModifier * partyModifier;
}