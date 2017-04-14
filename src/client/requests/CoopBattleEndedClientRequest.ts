import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { getEmbed, EMBED_COLORS } from '../../bot/util/ChatHelpers';
import { SocketCreature } from '../../core/creature/Creature';
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';

export interface IBattleEndedPlayer{
    player: SocketPlayerCharacter;
    wishesEarned: number;
}

export interface ClientRequestCoopBattleEndedData extends ClientRequestData{
    players: Array<IBattleEndedPlayer>;
    opponent: SocketCreature;
    victory: boolean;
    killer?: SocketPlayerCharacter;//required if victory is true
}

export default class CoopBattleEndedClientRequest extends ClientRequest{
    constructor(data:ClientRequestCoopBattleEndedData){
        super('CoopBattleEnded',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestCoopBattleEndedData):Promise<void>{
        let msg = '```fix\nBattle Over\n```';

        if(data.victory){
            if(data.victory){
                data.players.forEach(function(bp){
                    if(bp.wishesEarned > 0){
                        msg += `\n${bp.player.title} earned ${bp.wishesEarned} wishes`;
                    }
                });
            }

            bag.channel.sendMessage(msg);

            bag.channel.sendMessage('',getEmbed('\n:tada: YOU WERE VICTORIOUS :tada:',EMBED_COLORS.INFO));
        }
        else{
            bag.channel.sendMessage(msg);
            bag.channel.sendMessage('',getEmbed('\n:dizzy_face: YOU WERE DEFEATED :dizzy_face:',EMBED_COLORS.POISON));
        }
    }
}