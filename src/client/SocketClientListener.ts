import Logger from '../gameserver/log/Logger';
import ClientClientRequest from './ClientRequest';
import RoundBeginClientRequest from './Requests/RoundBeginClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData } from './ClientRequest';
import AttackedClientRequest from './Requests/AttackedClientRequest';
import BlockedClientRequest from './Requests/BlockedClientRequest';
import CoopBattleEndedClientRequest from './Requests/CoopBattleEndedClientRequest';
import EffectMessageClientRequest from './Requests/EffectMessageClientRequest';
import PassedOutClientRequest from './Requests/PassedOutClientRequest';
import PvPBattleExpiredClientRequest from './Requests/PvPBattleExpiredClientRequest';
import PvPBattleEndedClientRequest from './Requests/PvPBattleEndedClientRequest';
import DeleteChannelClientRequest from './Requests/DeleteChannelClientRequest';

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
        this.registerHandler(bag,new AttackedClientRequest(null));
        this.registerHandler(bag,new BlockedClientRequest(null));
        this.registerHandler(bag,new CoopBattleEndedClientRequest(null));
        this.registerHandler(bag,new DeleteChannelClientRequest(null));
        this.registerHandler(bag,new EffectMessageClientRequest(null));
        this.registerHandler(bag,new PassedOutClientRequest(null));
        this.registerHandler(bag,new PvPBattleEndedClientRequest(null));
        this.registerHandler(bag,new PvPBattleExpiredClientRequest(null));
        this.registerHandler(bag,new RoundBeginClientRequest(null));

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
                    channel: channel
                },data);
            }
            catch(ex){
                logger.error(ex);
            }
        });
    }
}