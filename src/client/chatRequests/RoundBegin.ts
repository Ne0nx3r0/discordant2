import { ChatRequestData } from '../ChatRequest';
import ChatRequest from '../ChatRequest';
import { TextChannel } from 'discord.js';

export interface ChatRequestRoundBeginData extends ChatRequestData{
    
}

export default class RoundBegin extends ChatRequest{
    constructor(data:ChatRequestRoundBeginData){
        super('RoundBegin',data);
    }
    
    async run(bag:ChatRequestRoundBeginData){
        bag.channel.sendMessage('```css\n--- NEW ROUND ---\n```');
    }
}