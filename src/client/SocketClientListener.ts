import Logger from '../gameserver/log/Logger';

interface SocketClientListenerBag{
    sioc:SocketIOClient.Socket;
    logger: Logger;
}

export default class SocketClientListener{
    sioc:SocketIOClient.Socket;
    logger: Logger;

    constructor(bag:SocketClientListenerBag){
        this.sioc = bag.sioc;
        this.logger = bag.logger;
    }
}