import { TextChannel } from "discord.js";

export interface ClientRequestReceiveBag{
    channel: TextChannel;
}

export interface ClientRequestData{
    channelId: string;
}

export default class ClientRequest{
    title:string;
    data:ClientRequestData;

    constructor(title:string,data:ClientRequestData){
        this.title = title;
        this.data = data;
    }

    send(client:SocketIO.Socket){
        client.emit(this.title,this.data);
    }

    async receive(bag:ClientRequestReceiveBag,data:ClientRequestData):Promise<void>{
        throw this.title +' does not implement receive';
    }
}