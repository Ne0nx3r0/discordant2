import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestRoundBeginData extends ClientRequestData{
    
}

export default class RoundBegin extends ClientRequest{
    constructor(data:ClientRequestRoundBeginData){
        super('RoundBegin',data);
    }
    
    async receive(bag:ClientRequestReceiveBag):Promise<void>{
        //this.data;
        bag.channel.sendMessage('```css\n--- NEW ROUND ---\n```');
    }
}