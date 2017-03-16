import * as SocketIO from 'socket.io';
import { SocketRequest, SocketResponse } from '../../core/socket/SocketRequests';
import Game from '../game/Game';
import GetPlayer from './handler/GetPlayer';
import Logger from '../log/Logger';

export type SocketServerRequestType = 'GetPlayer';

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
            this.registerHandler(client,'GetPlayer',GetPlayer);
        });

        this.io.listen(bag.port);
    }

    registerHandler(client:any,event:string,handler:Function){
        client.on(event,(data:any,callback:any)=>{
            (async()=>{
                let result:SocketResponse;

                try{
                    result = await handler(this.handlerBag,data);
                }
                catch(ex){
                    const did = this.logger.error(ex);

                    result = {
                        success: false,
                        error: `A server error occurred (${did})`,
                    }
                }
                finally{
                    callback(result);
                }
            })();
        });
    }
}