import ClientRequest from '../ClientRequest';
import { TextChannel } from 'discord.js';
import { ClientRequestData, ClientRequestReceiveBag } from '../ClientRequest';
import { BotConstants } from '../../bot/BotConstants';

export interface ClientRequestRevokePartyingData extends ClientRequestData{
    uids: Array<string>;
}

export default class RevokePartyingRoleClientRequest extends ClientRequest{
    constructor(data:ClientRequestRevokePartyingData){
        super('RevokePartying',data);
    }
    
    async receive(bag:ClientRequestReceiveBag,data:ClientRequestRevokePartyingData):Promise<void>{
        data.uids.forEach(function(uid){
            bag.bot.revokeChatRole(uid,BotConstants.ROLE_PARTYING_ID);
        });
    }
}