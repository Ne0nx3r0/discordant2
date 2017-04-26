import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { getEmbed, EMBED_COLORS } from '../../bot/util/ChatHelpers';

export interface ClientRequestChargedData extends ClientRequestData{
    chargerTitle:string;
    total:number;
}

export default class ChargedClientRequest extends ClientRequest{
    constructor(data:ClientRequestChargedData){
        super('Charged',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestChargedData):Promise<void>{
        bag.channel.sendMessage('',getEmbed(
            `${data.chargerTitle} collects ambient energy ${':comet: '.repeat(data.total)}`
        ,EMBED_COLORS.ACTION));
    }
}