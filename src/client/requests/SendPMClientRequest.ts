import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestSendPMData extends ClientRequestData{
    playerUid: string;
    message: string;
}

export default class SendPMClientRequest extends ClientRequest{
    constructor(data:ClientRequestSendPMData){
        super('SendPM',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestSendPMData):Promise<void>{
        bag.channel.client.users.get(data.playerUid).sendMessage(data.message);
    }
}