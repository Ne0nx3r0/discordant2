import * as SocketIO from 'socket.io';
import { SocketRequest, GetPlayerByUIDRequest, GetPlayerByUIDResponse, SocketResponse } from '../../core/socket/SocketRequests';
import Game from '../game/Game';
import GetPlayerByUID from './handler/GetPlayerByUID';

interface SocketServerBag{
    game:Game;
    port:number;
}

export interface SocketRequestHandlerBag{
    game:Game;
}


export default class SocketServer{
    io:SocketIO.Server;
    handlerBag:SocketRequestHandlerBag;

    constructor(bag:SocketServerBag){
        this.io = SocketIO();

        this.handlerBag = {
            game: bag.game
        };

        this.io.on('connection', (client)=>{
            this.registerHandler(client,SocketRequest.GET_PLAYER_BY_UID,GetPlayerByUID);
        });

        this.io.listen(bag.port);
    }

    registerHandler(client:any,event:string,handler:Function){
        client.on(event,(data:any,callback:any)=>{
            (async()=>{
                try{
                    callback(await handler(this.handlerBag,data));
                }
                catch(ex){
                    const result:SocketResponse = {
                        success:false,
                        error:ex
                    }

                    handler(result);
                }
            })();
        });
    }
}