import * as SocketIO from 'socket.io';
import Game from '../game/Game';
import Logger from '../log/Logger';
import GetPlayerRequest from './requests/GetPlayerRequest';
import GetPlayerRoleRequest from './requests/GetPlayerRoleRequest';
import ServerRequestRequest from './ServerRequest';
import { ServerResponse } from './ServerRequest';
import GetPlayerInventoryRequest from './requests/GetPlayerInventoryRequest';
import ServerRequest from './ServerRequest';

interface SocketServerBag{
    game:Game;
    port:number;
    logger:Logger;
}

export interface SocketRequestHandlerBag{
    game:Game;
}

export default class SocketServer{
    io:SocketIO.Server;
    handlerBag:SocketRequestHandlerBag;
    logger:Logger;

    constructor(bag:SocketServerBag){
        this.logger = bag.logger;

        this.io = SocketIO();

        this.handlerBag = {
            game: bag.game
        };

        //Mainly protects against typos
        const registeredEvents = [];

        this.io.on('connection', (client)=>{
            this.registerHandler(registeredEvents,client,new GetPlayerRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerRoleRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerInventoryRequest(null));
        });

        this.io.listen(bag.port);
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
                    result = await receiveFunc(this.handlerBag);
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