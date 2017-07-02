import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { getEmbed } from '../../bot/util/ChatHelpers';

export interface ClientRequestRevokeChannelPermissionsData extends ClientRequestData{
    kickUid: string;
    message?: string;
}

export default class RevokeChannelPermissionsClientRequest extends ClientRequest{
    constructor(data:ClientRequestRevokeChannelPermissionsData){
        super('RevokeChannelPermissions',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestRevokeChannelPermissionsData):Promise<void>{
        if(data.message){
            bag.channel.send(data.message);
        }

        bag.bot.revokePlayerAccessToChannel(bag.channel,data.kickUid);
    }
}