import { TextChannel } from "discord.js";

export interface ClientRequestReceiveBag{
    channel: TextChannel;
}

export interface ClientRequestData{

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

    async receive():Promise<void>{
        throw this.title +' does not implement receive';
    }
}