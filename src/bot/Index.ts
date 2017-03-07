import * as SocketIOClient from 'socket.io-client';
import { GetPlayerByUIDRequest, GetPlayerByUIDResponse, SocketRequest } from '../core/socket/SocketRequests';

class DiscordantBotNode {
    public static main(): number {
        const sioc = SocketIOClient('ws://localhost:3000');

        sioc.on('connect',function(){
            const emitData:GetPlayerByUIDRequest = {uid:'42'};

            sioc.emit(SocketRequest.GET_PLAYER_BY_UID,emitData,function(response:GetPlayerByUIDResponse){
                console.log(response);
            });
        });

        return 0;
    }
}

DiscordantBotNode.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});