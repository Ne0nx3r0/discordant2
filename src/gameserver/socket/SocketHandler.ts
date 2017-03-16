import { SocketRequestHandlerBag } from './SocketServer';

export interface SocketResponse{
    success:boolean;
    error?:string;
}

export interface SocketRequest{
    response?:SocketResponse;
}

export interface SocketHandlerFunc{
    (bag:SocketRequestHandlerBag,data:SocketRequest):Promise<SocketResponse>;
}

export default class SocketHandler{
    title:string;
    handlerFunc:SocketHandlerFunc;

    constructor(title:string,handler:SocketHandlerFunc){
        this.title = title;
        this.handlerFunc = handler;
    }
}