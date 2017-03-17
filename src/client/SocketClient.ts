import * as SocketIOClient from 'socket.io-client';
import { PermissionRole } from '../core/permissions/PermissionService';
import PermissionsService from '../core/permissions/PermissionService';
import { ISocketPlayer } from '../core/socket/ISocketPlayer';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../core/creature/player/PlayerCharacter';
import { GetPlayerRequest } from '../gameserver/socket/handlers/GetPlayer';
import GetPlayer  from '../gameserver/socket/handlers/GetPlayer';
import SocketHandler from '../gameserver/socket/SocketHandler';
import { SocketRequest, SocketResponse } from '../gameserver/socket/SocketHandler';
import RegisterPlayer from '../gameserver/socket/handlers/RegisterPlayer';
import { RegisterPlayerRequest } from '../gameserver/socket/handlers/RegisterPlayer';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    gameserver:string;
}

export default class SocketClient{
    sioc:SocketIOClient.Socket;
    
    constructor(bag:SocketClientBag){        
        this.sioc = SocketIOClient(bag.gameserver);
    }

    getPlayer(playerUID:string):Promise<SocketPlayerCharacter>{
        return (async()=>{
            const requestData:GetPlayerRequest = {
                uid:playerUID
            };

            const request:GetPlayerRequest = await this.gameserverRequest(GetPlayer,requestData);

            return request.response.player;
        })();
    }

    registerPlayer(bag:RegisterPlayerRequest):Promise<SocketPlayerCharacter>{
        return (async()=>{
            const requestData:RegisterPlayerRequest = {
                uid: bag.uid,
                username: bag.username,
                discriminator: bag.discriminator,
                classId: bag.classId,
            };

            const request:RegisterPlayerRequest = await this.gameserverRequest(RegisterPlayer,requestData);

            return request.response.player;
        })();
    }




// ---------------------------------------------------------
    addListener(event:SocketClientPushType,callback:Function){
        this.sioc.on(event,callback);
    }

    gameserverRequest<T>(handler:SocketHandler,requestData:T):Promise<T>{
        const sioc = this.sioc;

        return new Promise(function(resolve,reject){
            try{
                sioc.emit(handler.title,requestData,function(response:SocketResponse){
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