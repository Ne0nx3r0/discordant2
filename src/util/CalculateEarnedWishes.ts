import CreatureAIControlled from '../core/creature/CreatureAIControlled';
import PlayerCharacter from '../core/creature/player/PlayerCharacter';

export default function CalculateEarnedWishes(players:Array<PlayerCharacter>,opponent:CreatureAIControlled){
    const baseWishes = getBaseWishes(opponent.challengeRating);
    const partySize = players.length;

    let partyLevel = 0;
    
    players.forEach(function(player){
        if(partyLevel < player.level){
            partyLevel = player.level;
        }
    });

    
}