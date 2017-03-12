import * as SocketIOClient from 'socket.io-client';
import { SocketRequest, PlayerRoleUpdatedPush } from '../core/socket/SocketRequests';
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

    async getPlayer(playerUID):Promise<SocketPlayerCharacter>{
        const eventData:GetPlayerRequest = {
            uid:playerUID
        };

        const response:GetPlayerRequest = await this.emitPromise('GetPlayer',eventData);

        return response.response.player;
    }










// ---------------------------------------------------------
    addListener(event:SocketClientPushType,callback:Function){
        this.sioc.on(event,callback);
    }

    emitPromise<T>(event:SocketServerRequestType,eventData:T):Promise<T>{
        const sioc = this.sioc;

        return new Promise(function(resolve,reject){
            try{
                sioc.emit(event.toString(),eventData,function(response:any){
                    (eventData as SocketRequest).response  = response;

                    if(response.success){
                        eventData
                        resolve(eventData);
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