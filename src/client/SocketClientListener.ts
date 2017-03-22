import Logger from '../gameserver/log/Logger';

interface SocketClientListenerBag{
    sioc:SocketIOClient.Socket;
    logger: Logger;
}

export default class SocketClientListener{
    logger: Logger;

    constructor(bag:SocketClientListenerBag){
        this.logger = bag.logger;

        bag.sioc.on();
        RoundBegin
    }
}