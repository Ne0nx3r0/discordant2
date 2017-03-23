import * as SocketIO from 'socket.io';
import Game from '../game/Game';
import Logger from '../log/Logger';
import GetPlayer from './requests/GetPlayer';
import GetPlayerRole from './requests/GetPlayerRole';
import ServerRequest from './ServerRequest';
import { ServerResponse } from './ServerRequest';

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

        this.io.on('connection', (client)=>{
            this.registerHandler(client,new GetPlayer(null));
            this.registerHandler(client,new GetPlayerRole(null));
        });

        this.io.listen(bag.port);
    }

    registerHandler(client:any,handler:ServerRequest){
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