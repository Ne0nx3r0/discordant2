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
import RoundBeginRequest from '../../client/requests/RoundBeginRequest';
import DatabaseService from '../db/DatabaseService';

interface SocketServerBag{
    port:number;
    logger:Logger;
    db:DatabaseService;
}

export interface SocketRequestHandlerBag{
    game:Game;
}

export interface IGetRandomClientFunc{
    ():Promise<SocketIO.Client>;
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
            this.registerHandler(registeredEvents,client,new EquipPlayerItemRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerInventoryRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerRequest(null));
            this.registerHandler(registeredEvents,client,new GetPlayerRoleRequest(null));
            this.registerHandler(registeredEvents,client,new GrantPlayerItemRequest(null));
            this.registerHandler(registeredEvents,client,new GrantPlayerWishesRequest(null));
            this.registerHandler(registeredEvents,client,new GrantPlayerXPRequest(null));
            this.registerHandler(registeredEvents,client,new RegisterPlayerRequest(null));
            this.registerHandler(registeredEvents,client,new SetPlayerRoleRequest(null));
            this.registerHandler(registeredEvents,client,new TransferPlayerItemRequest(null));
            this.registerHandler(registeredEvents,client,new UnequipPlayerItemRequest(null));

            setTimeout(function(){
                const request = new RoundBeginRequest({channelId: '288157600854310912'});       

                request.send(client);     
            },10000);
        });

        this.io.listen(bag.port);
    }

    getRandomClient():Promise<SocketIO.Client>{
        return new Promise((resolve,reject)=>{
            this.io.clients((error, clients)=>{
                if(error){
                    this.logger.error(error);

                    reject(error);
                }
            });
        });
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
                    console.log(ex);
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