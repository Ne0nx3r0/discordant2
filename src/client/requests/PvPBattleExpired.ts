import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { getEmbed } from '../../bot/util/ChatHelpers';

export interface ClientRequestPvPBattleExpiredData extends ClientRequestData{
    
}

export default class PvPBattleExpiredRequest extends ClientRequest{
    constructor(data:ClientRequestPvPBattleExpiredData){
        super('PvPBattleExpired',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestPvPBattleExpiredData):Promise<void>{
        bag.channel.sendMessage('```fix\nBattle Expired\n```');

        bag.channel.sendMessage('',getEmbed(`Neither player participated so the battle ended in a draw`));

        bag.channel.sendMessage('',getEmbed(`Channel will expire in 1 minute`));
    }
}