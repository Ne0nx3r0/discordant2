import Logger from '../gameserver/log/Logger';
import ChatRequest from './ChatRequest';
import RoundBegin from './chatRequests/RoundBegin';
import { TextChannel } from 'discord.js';
import { ChatRequestData } from './ChatRequest';

interface ChannelLookupFunc{
    (channelId:string):TextChannel;
}

interface SocketClientListenerBag{
    sioc:SocketIOClient.Socket;
    logger: Logger;
    channelLookup: ChannelLookupFunc;
}

export default class SocketClientListener{
    constructor(bag:SocketClientListenerBag){
        //we can pass null in here because we just want the title
        this.registerHandler(bag,new RoundBegin(null));
    }

    registerHandler(bag:SocketClientListenerBag,handler:ChatRequest){
        const title = handler.title;
        const run = handler.run;
        const logger = bag.logger;
        const channelLookup = bag.channelLookup;

        bag.sioc.on(title,(data:ChatRequestData)=>{
            try{
                data.channel = channelLookup(data.channelId);

                if(!data.channel){
                    throw 'Invalid channel id '+data.channelId+' in request '+title;
                }

                run(data);
            }
            catch(ex){
                logger.error(ex);
            }
        });
    }
}