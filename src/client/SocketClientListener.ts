import Logger from '../gameserver/log/Logger';
import ClientRequest from './ClientRequest';
import RoundBeginRequest from './requests/RoundBeginRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData } from './ClientRequest';
import AttackedRequest from './requests/AttackedRequest';
import BlockedRequest from './requests/BlockedRequest';
import CoopBattleEndedRequest from './requests/CoopBattleEndedRequest';
import EffectMessageRequest from './requests/EffectMessageRequest';
import PassedOutRequest from './requests/PassedOutRequest';
import PvPBattleExpiredRequest from './requests/PvPBattleExpired';
import PvPBattleEndedRequest from './requests/PvPBattleEnded';
import DeleteChannelRequest from './requests/DeleteChannelRequest';

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
        this.registerHandler(bag,new AttackedRequest(null));
        this.registerHandler(bag,new BlockedRequest(null));
        this.registerHandler(bag,new CoopBattleEndedRequest(null));
        this.registerHandler(bag,new DeleteChannelRequest(null));
        this.registerHandler(bag,new EffectMessageRequest(null));
        this.registerHandler(bag,new PassedOutRequest(null));
        this.registerHandler(bag,new PvPBattleEndedRequest(null));
        this.registerHandler(bag,new PvPBattleExpiredRequest(null));
        this.registerHandler(bag,new RoundBeginRequest(null));
    }

    registerHandler(bag:SocketClientListenerBag,handler:ClientRequest){
        const title = handler.title;
        const receive = handler.receive;
        const logger = bag.logger;
        const channelLookup = bag.channelLookup;

        bag.sioc.on(title,(data:ClientRequestData)=>{
            try{
                const channel = channelLookup(data.channelId);
                
                if(!channel){
                    throw 'Invalid channel id '+data.channelId+' in request '+title;
                }

                receive({
                    channel: channel
                },data);
            }
            catch(ex){
                logger.error(ex);
            }
        });
    }
}