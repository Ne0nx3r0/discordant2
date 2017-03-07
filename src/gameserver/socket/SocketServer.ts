import * as SocketIO from 'socket.io';
import { SocketRequest, GetPlayerByUIDRequest, GetPlayerByUIDResponse } from '../../core/socket/SocketRequests';

interface SocketServerBag{
    port:number;
}

export default class SocketServer{
    io:SocketIO.Server;

    constructor(bag:SocketServerBag){
        this.io = SocketIO();

        this.getPlayerByUID = this.getPlayerByUID.bind(this);
    
        this.io.on('connection', (client)=>{
            client.on(SocketRequest.GET_PLAYER_BY_UID,this.getPlayerByUID);
        });

        this.io.listen(bag.port);
    }

    getPlayerByUID(data:GetPlayerByUIDRequest,callback){
        const response:GetPlayerByUIDResponse = {
            uid: data.uid,
            title:'Some player title',
        };

        callback(response);
    }
}