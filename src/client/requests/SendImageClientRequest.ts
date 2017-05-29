import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestSendImageData extends ClientRequestData{
    imageUrl: string;
    message: string;
}

export default class SendImageClientRequest extends ClientRequest{
    constructor(data:ClientRequestSendImageData){
        super('SendImage',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestSendImageData):Promise<void>{
        bag.channel.send('',{
            embed: {
                color: 0x36393E,
                image: { 
                    url: data.imageUrl, 
                    height: 288, 
                    width: 288,
                },   
                description: data.message,      
            }
        });
    }
}