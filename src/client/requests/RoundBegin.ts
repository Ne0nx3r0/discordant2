import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestRunBag } from '../ClientRequest';

export interface ClientRequestRoundBeginData extends ClientRequestData{
    
}

export default class RoundBegin extends ClientRequest{
    constructor(data:ClientRequestRoundBeginData){
        super('RoundBegin',data);
    }
    
    async run(bag:ClientRequestRunBag):Promise<void>{
        //this.data;
        bag.channel.sendMessage('```css\n--- NEW ROUND ---\n```');
    }
}