import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';

export interface ClientRequestSendAddPartyMemberData extends ClientRequestData{
    playerUid: string;
}

export default class SendAddPartyMemberClientRequest extends ClientRequest{
    constructor(data:ClientRequestSendAddPartyMemberData){
        super('SendAddPartyMember',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestSendAddPartyMemberData):Promise<void>{
        bag.bot.grantPlayerWriteAccessToChannel(bag.channel,data.playerUid);
        
        bag.channel.send(`<@${data.playerUid}> joined the party!`);
    }
}