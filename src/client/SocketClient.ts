import * as SocketIOClient from 'socket.io-client';
import { SocketRequest, GetPlayerRoleByUIDRequest, SocketRequestType, PlayerRoleUpdatedPush, SocketPushType } from '../core/socket/SocketRequests';
import { SocketRequestHandlerBag } from '../gameserver/socket/SocketServer';
import { PermissionRole } from '../core/permissions/PermissionService';
import PermissionsService from '../core/permissions/PermissionService';

export default class SocketClient{
    sioc:SocketIOClient.Socket;
    cachedRoles:Map<string,PermissionRole>;
    permissions:PermissionsService;

    constructor(permissions:PermissionsService){        
        this.permissions = permissions; 
        this.cachedRoles = new Map();

        this.sioc = SocketIOClient('ws://localhost:3000');

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

        const eventData:GetPlayerRoleByUIDRequest = {
            uid:playerUID
        };

        const response = await this.emitPromise('GetPlayerRole',eventData);

        const role = this.permissions.getRole(response.response.role);

        this.cachedRoles.set(response.uid,role);

        return role;
    }












// ---------------------------------------------------------
    addListener(event:SocketPushType,callback:Function){
        this.sioc.on(event,callback);
    }

    emitPromise<T>(event:SocketRequestType,eventData:T):Promise<T>{
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