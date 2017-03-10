import * as SocketIOClient from 'socket.io-client';
import { GetPlayerByUIDRequest, GetPlayerByUIDResponse, SocketRequest } from '../core/socket/SocketRequests';
import { PermissionRole } from '../core/permissions/PermissionService';

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

    getPlayerRole(playerUID):Promise<string>{
        return (async()=>{
            try{
                this.sioc.emit(SocketRequest.GetPlayerRole,emitData,function(response:GetPlayerByUIDResponse){
                    console.log(response);
                });
            }
            catch(ex){
                console.log(ex);

                throw 'An unexpected socket exception occurred';
            }
        })();
    }
}