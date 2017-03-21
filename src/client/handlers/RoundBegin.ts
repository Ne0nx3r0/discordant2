import ClientSend from '../ClientSend';
import { ClientSendBag, ClientSendData } from '../ClientSend';

export interface ClientSendRoundBeginData extends ClientSendData{
    
}

export default new ClientSend('RoundBegin',async function(bag:ClientSendBag,data:ClientSendRoundBeginData){
    Since so far every request will have a channel ID let's just look upt he channel and give it to this handler, which may justify the register function for these guys
});