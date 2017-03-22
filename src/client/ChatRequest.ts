import { TextChannel } from "discord.js";

export interface ChatRequestBag {
    channel:TextChannel;
}

export interface ChatRequestData{
    channelId: string;
}

export interface ChatRequestHandlerFunc{
    (bag:ChatRequestBag,data:ChatRequestData):Promise<void>;
}

export default class ChatRequest{
    title:string;
    handlerFunc:ChatRequestHandlerFunc;

    constructor(title:string,handler:ChatRequestHandlerFunc){
        this.title = title;
        this.handlerFunc = handler;
    }
}