import { TextChannel } from "discord.js";

export interface ChatRequestData{
    channelId: string;
    channel?: TextChannel;//Filled in by SocketClientListener
}

export interface ChatRequestHandlerFunc{
    (data:ChatRequestData):Promise<void>;
}

export default class ChatRequest{
    title:string;
    data:ChatRequestData;

    constructor(title:string,data:ChatRequestData){
        this.title = title;
        this.data = data;
    }

    async run(bag:ChatRequestData){
        throw this.title +' does not implement run';
    }
}