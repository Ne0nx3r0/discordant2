import * as SocketIO from 'socket.io';
import Game from '../game/Game';
import Logger from '../log/Logger';
import SocketHandler from './SocketHandler';
import GetPlayer from './handlers/GetPlayer';
import RegisterPlayer from './handlers/RegisterPlayer';
import { SocketResponse } from './SocketHandler';
import GetPlayerRole from './handlers/GetPlayerRole';
import GetPlayerInventory from './handlers/GetPlayerInventory';
import GrantPlayerItem from './handlers/GrantPlayerItem';
import GrantPlayerXP from './handlers/GrantPlayerXP';
import GrantPlayerWishes from './handlers/GrantPlayerWishes';
import EquipPlayerItem from './handlers/EquipPlayerItem';
import UnequipPlayerItem from './handlers/UnequipPlayerItem';
import TransferPlayerItem from './handlers/TransferPlayerItem';
import SetPlayerRole from './handlers/SetPlayerRole';
import SocketClientHandler from '../../client/SocketClientHandler';
import { SocketClientRequest, SocketClientResponse } from '../../client/SocketClientHandler';

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
            this.registerHandler(client,GetPlayer);
            this.registerHandler(client,GetPlayerRole);
            this.registerHandler(client,RegisterPlayer);
            this.registerHandler(client,GetPlayerInventory);
            this.registerHandler(client,GrantPlayerItem);
            this.registerHandler(client,GrantPlayerWishes);
            this.registerHandler(client,GrantPlayerXP);
            this.registerHandler(client,EquipPlayerItem);
            this.registerHandler(client,UnequipPlayerItem);
            this.registerHandler(client,TransferPlayerItem);
            this.registerHandler(client,SetPlayerRole);
        });

        this.io.listen(bag.port);
    }

    clientRequest<T>(handler:SocketClientHandler,requestData:T):Promise<T>{
        const clientIds:Array<string> = Object.keys(this.io.sockets.sockets);

        const randomClientId = clientIds[Math.floor(Math.random()*clientIds.length)];

        const randomClient = this.io.sockets.sockets[randomClientId];

        return new Promise(function(resolve,reject){
            try{
                randomClient.emit(handler.title,requestData,function(response:SocketClientResponse){
                    (requestData as SocketClientRequest).response  = response;

                    if(response.success){
                        resolve(requestData);
                    }
                    else{
                        reject(response.error);
                    }
                });
            }
            catch(ex){
                reject(ex);
            }
        });
    }

    registerHandler(client:any,handler:SocketHandler){
        client.on(handler.title,(data:any,callback:any)=>{
            (async()=>{
                let result:SocketResponse;

                try{
                    result = await handler.handlerFunc(this.handlerBag,data);
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