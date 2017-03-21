export interface ClientSendBag{
    channel:TextChannel;
}

export interface ClientSendData{
    channelId: string;
}

export interface ClientSendHandlerFunc{
    (bag:ClientSendBag,data:ClientSendData):Promise<void>;
}

export default class ClientSend{
    title:string;
    handlerFunc:ClientSendHandlerFunc;

    constructor(title:string,handler:ClientSendHandlerFunc){
        this.title = title;
        this.handlerFunc = handler;
    }
}