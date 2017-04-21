import Logger from '../gameserver/log/Logger';
import ClientClientRequest from './ClientRequest';
import RoundBeginClientRequest from './requests/RoundBeginClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData } from './ClientRequest';
import AttackedClientRequest from './requests/AttackedClientRequest';
import BlockedClientRequest from './requests/BlockedClientRequest';
import CoopBattleEndedClientRequest from './requests/CoopBattleEndedClientRequest';
import EffectMessageClientRequest from './requests/EffectMessageClientRequest';
import PassedOutClientRequest from './requests/PassedOutClientRequest';
import PvPBattleExpiredClientRequest from './requests/PvPBattleExpiredClientRequest';
import PvPBattleEndedClientRequest from './requests/PvPBattleEndedClientRequest';
import DeleteChannelClientRequest from './requests/DeleteChannelClientRequest';
import SendMessageClientRequest from './requests/SendMessageClientRequest';
import SendPMClientRequest from './requests/SendPMClientRequest';
import SendImageClientRequest from './requests/SendImageClientRequest';
import SocketClientRequester from './SocketClientRequester';
import SendLocalImageClientRequest from './requests/SendLocalImageClientRequest';
import Bot from '../bot/Bot';

interface ChannelLookupFunc{
    (channelId:string):TextChannel;
}

interface SocketClientListenerBag{
    sioc:SocketIOClient.Socket;
    logger: Logger;
    socket: SocketClientRequester;
    channelLookup: ChannelLookupFunc;
    bot: Bot
}

export default class SocketClientListener{
    constructor(bag:SocketClientListenerBag){
        //we can pass null in here because we just want the title
        this.registerHandler(bag,new AttackedClientRequest(null));
        this.registerHandler(bag,new BlockedClientRequest(null));
        this.registerHandler(bag,new CoopBattleEndedClientRequest(null));
        this.registerHandler(bag,new DeleteChannelClientRequest(null));
        this.registerHandler(bag,new EffectMessageClientRequest(null));
        this.registerHandler(bag,new PassedOutClientRequest(null));
        this.registerHandler(bag,new PvPBattleEndedClientRequest(null));
        this.registerHandler(bag,new PvPBattleExpiredClientRequest(null));
        this.registerHandler(bag,new RoundBeginClientRequest(null));
        this.registerHandler(bag,new SendMessageClientRequest(null));
        this.registerHandler(bag,new SendPMClientRequest(null));
        this.registerHandler(bag,new SendImageClientRequest(null));
        this.registerHandler(bag,new SendLocalImageClientRequest(null));

        var socket = bag.sioc;//using this syntax to avoid pissing off typescript
        var onevent = socket['onevent'];
        var eventNames = Object.keys(socket['_callbacks']).map(function(callback){
            return callback.substr(1);
        });

        socket['onevent'] = function (packet) {
            onevent.call(this, packet);// original call
            
            var handlerName = packet.data[0];

            if(eventNames.indexOf(handlerName) == -1){
                console.error('No handler for emitted event: '+handlerName);
            }
        };
    }

    registerHandler(bag:SocketClientListenerBag,handler:ClientClientRequest){
        const title = handler.title;
        const receive = handler.receive;
        const logger = bag.logger;
        const channelLookup = bag.channelLookup;

        bag.sioc.on(title,(data:ClientRequestData)=>{
            try{
                const channel = channelLookup(data.channelId);
                
                if(!channel){
                    throw 'Invalid channel id '+data.channelId+' in ClientRequest '+title;
                }

                receive({
                    channel: channel,
                    logger: logger,
                    socket: bag.socket,
                    sioc: bag.sioc,
                    bot: bag.bot,
                },data);
            }
            catch(ex){
                logger.error(ex);
            }
        });
    }
}