import * as SocketIO from 'socket.io';
import Game from '../game/Game';
import Logger from '../log/Logger';
import GetPlayerRequest from './requests/GetPlayerRequest';
import GetPlayerRoleRequest from './requests/GetPlayerRoleRequest';
import ServerRequestRequest from './ServerRequest';
import { ServerResponse } from './ServerRequest';
import GetPlayerInventoryRequest from './requests/GetPlayerInventoryRequest';
import ServerRequest from './ServerRequest';
import SetPlayerRoleRequest from './requests/SetPlayerRoleRequest';
import GrantPlayerXPRequest from './requests/GrantPlayerXPRequest';
import GrantPlayerWishesRequest from './requests/GrantPlayerWishesRequest';
import GrantPlayerItemRequest from './requests/GrantPlayerItemRequest';
import RegisterPlayerRequest from './requests/RegisterPlayerRequest';
import EquipPlayerItemRequest from './requests/EquipPlayerItemRequest';
import TransferPlayerItemRequest from './requests/TransferPlayerItemRequest';
import UnequipPlayerItemRequest from './requests/UnequipPlayerItemRequest';
import DatabaseService from '../db/DatabaseService';
import CreatePvPBattleRequest from './requests/CreatePvPBattleRequest';
import { CreatePvPInviteData } from './requests/CreatePvPInviteRequest';
import CreatePvPInviteRequest from './requests/CreatePvPInviteRequest';
import GetPvPInviteRequest from './requests/GetPvPInviteRequest';
import BattleAttackRequest from './requests/BattleAttackRequest';
import BattleBlockRequest from './requests/BattleBlockRequest';
import CreatePartyRequest from './requests/CreatePartyRequest';
import SetPartyExploringRequest from './requests/SetPartyExploringRequest';
import SetSliceRemoteUrlRequest from './requests/SetSliceRemoteUrlRequest';

interface SocketServerBag{
    port:number;
    logger:Logger;
    db:DatabaseService;
}

export interface SocketRequestHandlerBag{
    game:Game;
}

export interface IGetRandomClientFunc{
    ():SocketIO.Socket;
}

export default class SocketServer{
    io:SocketIO.Server;
    logger:Logger;
    game: Game;

    constructor(bag:SocketServerBag){
        this.logger = bag.logger;

        this.io = SocketIO();

        this.game = new Game({
            db: bag.db,
            getRandomClient: this.getRandomClient.bind(this) as IGetRandomClientFunc
        });

        //Mainly protects against typos
        const registeredEvents = [];

        this.io.on('connection', (client)=>{
            this.registerHandler(registeredEvents,client,new BattleAttackRequest(null));
            this.registerHandler(registeredEvents,client,new BattleBlockRequest(null));
            this.registerHandler(registeredEvents,client,new CreatePartyRequest(null));
            this.registerHandler(registeredEvents,client,new CreatePvPBattleRequest(null));
            this.registerHandler(registeredEvents,client,new CreatePvPInviteRequest(null));
            this.registerHandler(registeredEvents,client,new EquipPlayerItemRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerInventoryRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerRoleRequest(null));
            this.registerHandler(registeredEvents,client,new GetPvPInviteRequest(null));
            this.registerHandler(registeredEvents,client,new GrantPlayerItemRequest(null));
            this.registerHandler(registeredEvents,client,new GrantPlayerWishesRequest(null));
            this.registerHandler(registeredEvents,client,new GrantPlayerXPRequest(null));
            this.registerHandler(registeredEvents,client,new RegisterPlayerRequest(null));
            this.registerHandler(registeredEvents,client,new SetPartyExploringRequest(null));
            this.registerHandler(registeredEvents,client,new SetPlayerRoleRequest(null));
            this.registerHandler(registeredEvents,client,new SetSliceRemoteUrlRequest(null));
            this.registerHandler(registeredEvents,client,new TransferPlayerItemRequest(null));
            this.registerHandler(registeredEvents,client,new UnequipPlayerItemRequest(null));

            var socket = client;
            var onevent = socket['onevent'];//using this syntax to avoid pissing off typescript
            var eventNames = Object.keys(socket['_events']);
            socket['onevent'] = function (packet) {
                onevent.call(this, packet);// original call
                
                var handlerName = packet.data[0];

                if(eventNames.indexOf(handlerName) == -1){
                    console.error('No handler for emitted event: '+handlerName);
                }
            };
        });

        this.io.listen(bag.port);
    }

    getRandomClient():SocketIO.Socket{
        const connectedSocketIds = Object.keys(this.io.sockets.sockets);
        const randomSocketId = connectedSocketIds[Math.floor(Math.random() * connectedSocketIds.length)];
        const randomSocket = this.io.sockets.sockets[randomSocketId] as SocketIO.Socket;

        return randomSocket;
    }

    registerHandler(registeredEvents:Array<string>,client:any,handler:ServerRequest){
        if(registeredEvents.indexOf(handler.title) > -1){
            throw `SocketServer tried to register event "${handler.title}" twice!`;
        }

        const receiveFunc = handler.receive;

        client.on(handler.title,(data:any,callback:any)=>{
            (async()=>{
                let result:ServerResponse;

                try{
                    result = await receiveFunc({
                        game: this.game
                    },data);
                }
                catch(ex){

                    //If it's a string send it back to the client, otherwise create a did and send that back
                    if(typeof ex === 'string' || ex instanceof String){
                        result = {
                            success: false,
                            error: ex as string,
                        }
                    }
                    else{
                        console.log(ex);
                        
                        const did = this.logger.error(ex);

                        result = {
                            success: false,
                            error: `A server error occurred (${did})`,
                        }
                    }
                }
                finally{
                    callback(result);
                }
            })();
        });
    }
}