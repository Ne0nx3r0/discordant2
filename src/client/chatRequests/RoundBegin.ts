import { ChatRequestData, ChatRequestBag } from '../ChatRequest';
import ChatRequest from '../ChatRequest';
import { TextChannel } from 'discord.js';

export interface ChatRequestRoundBeginData extends ChatRequestData{
    
}

export default new ChatRequest('RoundBegin',async function(bag:ChatRequestBag,data:ChatRequestRoundBeginData){
    //const channel:TextChannel = bag.getChannel(data.channelId);
    
    //channel.sendMessage('```css\n--- NEW ROUND ---\n```');
});