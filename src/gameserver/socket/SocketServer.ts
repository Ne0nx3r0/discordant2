import * as SocketIO from 'socket.io';
import { SocketGetPlayerByUID, SocketGetPlayerByUIDResponse } from '../../core/socket/SocketEvents';
import SocketEvents from '../../core/socket/SocketEvents';

interface SocketServerBag{
    port:number;
}

export default class SocketServer{
    io:SocketIO.Server;

    constructor(bag:SocketServerBag){
        this.io = SocketIO();
    
        this.io.on('connection', function(client){
            console.log('client connected');

            client.on(SocketEvents.GET_PLAYER_BY_UID,function(data:SocketGetPlayerByUID,callback){
                console.log('getPlayerByUid',data);

                const response:SocketGetPlayerByUIDResponse = {
                    uid: data.uid,
                    title:'Some player title',
                };
console.log(callback);
                callback(response);
            });       
        });

        this.io.listen(bag.port);
    }
}