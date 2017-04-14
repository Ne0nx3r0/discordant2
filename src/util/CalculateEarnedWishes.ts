import CreatureAIControlled from '../core/creature/CreatureAIControlled';
import PlayerCharacter from '../core/creature/player/PlayerCharacter';
import PartyExplore from '../bot/commands/PartyExplore';

const PARTY_PENALTY = 0.02;
const LEVEL_PENALTY = 0.01;

export default function CalculateEarnedWishes(players:Array<PlayerCharacter>,opponent:CreatureAIControlled){
    const baseWishes = opponent.wishesDropped;
    const partySize = players.length;

    let partyLevel = 0;
    
    players.forEach(function(player){
        if(partyLevel < player.level){
            partyLevel = player.level;
        }
    });

    const partyModifier = 1- (partySize-1) * PARTY_PENALTY;
    const levelModifier = 1 - LEVEL_PENALTY * partyLevel + LEVEL_PENALTY;

    return baseWishes * levelModifier * partyModifier;
}