import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { getEmbed } from '../../bot/util/ChatHelpers';
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';

export interface ClientRequestPvPBattleEndedData extends ClientRequestData{
    winner:SocketPlayerCharacter;
    loser:SocketPlayerCharacter;
}

export default class PvPBattleEndedClientRequest extends ClientRequest{
    constructor(data:ClientRequestPvPBattleEndedData){
        super('PvPBattleEnded',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestPvPBattleEndedData):Promise<void>{
        bag.channel.sendMessage('```fix\nBattle Over\n```');

        bag.channel.sendMessage('',getEmbed(`:tada: ${data.winner.title} has defeated ${data.loser.title} :tada:`));

        bag.channel.sendMessage('',getEmbed(`Channel will expire in 1 minute`));
        
        setTimeout(function(){
            bag.channel.delete();
        },60000);
    }
}