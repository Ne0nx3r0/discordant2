import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestChargedData extends ClientRequestData{
    chargerTitle:string;
}

export default class ChargedClientRequest extends ClientRequest{
    constructor(data:ClientRequestChargedData){
        super('Charged',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestChargedData):Promise<void>{
        bag.channel.sendMessage(`:comet: ${data.chargerTitle} collects ambient energy :comet:`);
    }
}