import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestBlockedData extends ClientRequestData{
    blockerTitle:string;
}

export default class BlockedClientRequest extends ClientRequest{
    constructor(data:ClientRequestBlockedData){
        super('Blocked',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestBlockedData):Promise<void>{
        bag.channel.sendMessage(`:shield: ${data.blockerTitle} blocks! :shield:`);
    }
}