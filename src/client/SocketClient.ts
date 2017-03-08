import * as SocketIOClient from 'socket.io-client';
import { GetPlayerByUIDRequest, GetPlayerByUIDResponse, SocketRequest } from '../core/socket/SocketRequests';

export default class SocketClient{
    constructor(){
        const sioc = SocketIOClient('ws://localhost:3000');

        sioc.on('connect',function(){
            const emitData:GetPlayerByUIDRequest = {uid:'42'};

            sioc.emit(SocketRequest.GetPlayerByUID,emitData,function(response:GetPlayerByUIDResponse){
                console.log(response);
            });
        });

        return 0;
    }
}