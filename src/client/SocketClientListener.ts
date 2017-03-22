import Logger from '../gameserver/log/Logger';
import ClientRequest from './ClientRequest';
import RoundBegin from './requests/RoundBegin';
import { TextChannel } from 'discord.js';
import { ClientRequestData } from './ClientRequest';

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

    registerHandler(bag:SocketClientListenerBag,handler:ClientRequest){
        const title = handler.title;
        const run = handler.run;
        const logger = bag.logger;
        const channelLookup = bag.channelLookup;

        bag.sioc.on(title,(data:ClientRequestData)=>{
            try{
                const channel = channelLookup(data.channelId);
                
                if(!channel){
                    throw 'Invalid channel id '+data.channelId+' in request '+title;
                }

                run({
                    channel: channel
                });
            }
            catch(ex){
                logger.error(ex);
            }
        });
    }
}