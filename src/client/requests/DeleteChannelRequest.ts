import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestDeleteChannelData extends ClientRequestData{
    
}

export default class DeleteChannelRequest extends ClientRequest{
    constructor(data:ClientRequestDeleteChannelData){
        super('DeleteChannel',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestDeleteChannelData):Promise<void>{
        bag.channel.delete();
    }
}