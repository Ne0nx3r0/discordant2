import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestSendMessageData extends ClientRequestData{
    message:string;
}

export default class SendMessageClientRequest extends ClientRequest{
    constructor(data:ClientRequestSendMessageData){
        super('SendMessage',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestSendMessageData):Promise<void>{
        bag.channel.sendMessage(data.message);
    }
}