import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { getEmbed } from '../../bot/util/ChatHelpers';

export interface ClientRequestEffectMessageData extends ClientRequestData{
    msg:string;
    color:number;
}

export default class EffectMessageClientRequest extends ClientRequest{
    constructor(data:ClientRequestEffectMessageData){
        super('EffectMessage',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestEffectMessageData):Promise<void>{
        bag.channel.send('',getEmbed(data.msg,data.color));
    }
}