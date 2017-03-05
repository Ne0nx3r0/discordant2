import * as SocketIOClient from 'socket.io-client';
import { SocketGetPlayerByUID, SocketGetPlayerByUIDResponse } from '../core/socket/SocketEvents';
import SocketEvents from '../core/socket/SocketEvents';

class DiscordantBotNode {
    public static main(): number {
        const sioc = SocketIOClient('ws://localhost:3000');

        sioc.on('connect',function(){
            const emitData:SocketGetPlayerByUID = {uid:'42'};

            sioc.emit(SocketEvents.GET_PLAYER_BY_UID,emitData,function(response:SocketGetPlayerByUIDResponse){
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