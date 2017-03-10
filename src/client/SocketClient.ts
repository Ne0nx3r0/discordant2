import * as SocketIOClient from 'socket.io-client';
import { GetPlayerByUIDRequest, GetPlayerByUIDResponse, SocketRequest, GetPlayerRoleByUIDRequest, SocketRequestType } from '../core/socket/SocketRequests';
import { PermissionRole } from '../core/permissions/PermissionService';
import { SocketRequestHandlerBag } from '../gameserver/socket/SocketServer';

export default class SocketClient{
    sioc:SocketIOClient.Socket;
    constructor(){
        this.sioc = SocketIOClient('ws://localhost:3000');

        this.sioc.on('connect',()=>{
            const emitData:GetPlayerByUIDRequest = {uid:'42'};

            this.sioc.emit(SocketRequest.GetPlayerByUID,emitData,function(response:GetPlayerByUIDResponse){
                console.log(response);
            });
        });
    }
/*
    getPlayerRole(playerUID):Promise<string>{
        const emitData:GetPlayerRoleByUIDRequest = {
            uid:playerUID
        };

        return new Promise((resolve,reject)=>{
            try{
                this.sioc.emit(SocketRequest.GetPlayerRole,function(response:GetPlayerRoleByUIDResponse){
                    if(response.success){
                        resolve(response.role);
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
*/
    async getPlayerRole(playerUID):Promise<string>{
        const eventData:GetPlayerRoleByUIDRequest = {
            uid:playerUID
        };

        const response = await this.emitPromise(SocketRequestType.GetPlayerRole,eventData);

        return response.uid;
    }





    
    
    emitPromise<T>(event:SocketRequest,eventData:T):Promise<T>{
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