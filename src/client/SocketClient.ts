import * as SocketIOClient from 'socket.io-client';
import { SocketRequest, PlayerRoleUpdatedPush, SocketResponse } from '../core/socket/SocketRequests';
import { SocketRequestHandlerBag, SocketServerRequestType } from '../gameserver/socket/SocketServer';
import { PermissionRole } from '../core/permissions/PermissionService';
import PermissionsService from '../core/permissions/PermissionService';
import { GetPlayerRequest, GetPlayerResponse } from '../gameserver/socket/handler/GetPlayer';
import { ISocketPlayer } from '../core/socket/ISocketPlayer';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../core/creature/player/PlayerCharacter';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    gameserver:string;
}

export default class SocketClient{
    sioc:SocketIOClient.Socket;
    
    constructor(bag:SocketClientBag){        
        this.sioc = SocketIOClient(bag.gameserver);
    }

    getPlayer(playerUID):Promise<SocketPlayerCharacter>{
        return (async()=>{
            const requestData:GetPlayerRequest = {
                uid:playerUID
            };

            const request:GetPlayerRequest = await this.emitPromise('GetPlayer',requestData);

            return request.response.player;
        })();
    }






// ---------------------------------------------------------
    addListener(event:SocketClientPushType,callback:Function){
        this.sioc.on(event,callback);
    }

    emitPromise<T>(event:SocketServerRequestType,requestData:T):Promise<T>{
        const sioc = this.sioc;

        return new Promise(function(resolve,reject){
            try{
                sioc.emit(event.toString(),requestData,function(response:SocketResponse){
                    (requestData as SocketRequest).response  = response;

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
}