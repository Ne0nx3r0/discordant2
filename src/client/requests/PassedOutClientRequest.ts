import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestPassedOutData extends ClientRequestData{
    creatureTitle:string;
    lostWishes?:number;
}

export default class PassedOutRequest extends ClientRequest{
    constructor(data:ClientRequestPassedOutData){
        super('PassedOut',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestPassedOutData):Promise<void>{
        const wishesLost = data.lostWishes?` (Lost ${data.lostWishes} wishes)`:'';

        bag.channel.send(`:skull_crossbones: ${data.creatureTitle} passed out!${wishesLost} :skull_crossbones:`);
    }
}