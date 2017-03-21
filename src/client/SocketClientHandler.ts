export interface SocketClientRequestHandlerBag{

}

export interface SocketClientResponse{
    success:boolean;
    error?:string;
}

export interface SocketClientRequest{
    response?:SocketClientResponse;
}

export interface SocketClientHandlerFunc{
    (bag:SocketClientRequestHandlerBag,data:SocketClientRequest):Promise<SocketClientResponse>;
}

export default class SocketHandler{
    title:string;
    handlerFunc:SocketClientHandlerFunc;

    constructor(title:string,handler:SocketClientHandlerFunc){
        this.title = title;
        this.handlerFunc = handler;
    }
}