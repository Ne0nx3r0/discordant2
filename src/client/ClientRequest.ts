import { TextChannel } from "discord.js";

export interface ClientRequestRunBag{
    channel?: TextChannel;
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

    async run(bag:ClientRequestRunBag):Promise<void>{
        throw this.title +' does not implement run';
    }
}