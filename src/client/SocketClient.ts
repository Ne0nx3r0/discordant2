import * as SocketIOClient from 'socket.io-client';
import { SocketRequest, PlayerRoleUpdatedPush } from '../core/socket/SocketRequests';
import { SocketRequestHandlerBag, SocketServerRequestType } from '../gameserver/socket/SocketServer';
import { PermissionRole } from '../core/permissions/PermissionService';
import PermissionsService from '../core/permissions/PermissionService';
import { GetPlayerRoleRequest } from '../gameserver/socket/handler/GetPlayerRole';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    permissions:PermissionsService;
    gameserver:string;
}

export default class SocketClient{
    sioc:SocketIOClient.Socket;
    cachedRoles:Map<string,PermissionRole>;
    permissions:PermissionsService;

    constructor(bag:SocketClientBag){        
        this.permissions = bag.permissions; 
        this.cachedRoles = new Map();

        this.sioc = SocketIOClient(bag.gameserver);

        this.sioc.on('connect',()=>{
            this.addListener('PlayerRoleUpdated',(e:PlayerRoleUpdatedPush)=>{
                this.cachedRoles.delete(e.playerUid);
            });
        });
    }

    async getPlayerRole(playerUID):Promise<PermissionRole>{
        let playerRole = this.cachedRoles.get(playerUID);

        if(playerRole){
            return playerRole;
        }

        const eventData:GetPlayerRoleRequest = {
            uid:playerUID
        };

        const response = await this.emitPromise('GetPlayerRole',eventData);

        const role = this.permissions.getRole(response.response.role);

        this.cachedRoles.set(response.uid,role);

        return role;
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