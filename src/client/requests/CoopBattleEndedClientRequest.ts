import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { getEmbed, EMBED_COLORS } from '../../bot/util/ChatHelpers';
import { SocketCreature } from '../../core/creature/Creature';
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';


export interface ClientRequestCoopBattleEndedData extends ClientRequestData{
    players: Array<{
        player: SocketPlayerCharacter;
        //xpEarned: xpEarned,
    }>,
    opponent: SocketCreature;
    victory: boolean,
    killer?: SocketPlayerCharacter;//required if victory is true
}

export default class CoopBattleEndedClientRequest extends ClientRequest{
    constructor(data:ClientRequestCoopBattleEndedData){
        super('CoopBattleEnded',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestCoopBattleEndedData):Promise<void>{
        bag.channel.sendMessage('```fix\nBattle Over\n```');

        if(data.victory){
            bag.channel.sendMessage('',getEmbed('\n:tada: YOU WERE VICTORIOUS :tada:',EMBED_COLORS.INFO));
        }
        else{
            bag.channel.sendMessage('',getEmbed('\n:dizzy_face: YOU WERE DEFEATED :dizzy_face:',EMBED_COLORS.POISON));
        }
    }
}