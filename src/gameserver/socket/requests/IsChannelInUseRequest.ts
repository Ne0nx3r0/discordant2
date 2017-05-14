import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface IsChannelInUseData extends ServerRequestData{
    channelId: string;
}

export interface IsChannelInUseResponse extends ServerResponse{
    inUse: boolean;
}

export default class IsChannelInUseRequest extends ServerRequest{
    constructor(data:IsChannelInUseData){
        super('IsChannelInUse',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<IsChannelInUseResponse>{
        return await this._send(sioc) as IsChannelInUseResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:IsChannelInUseData):Promise<IsChannelInUseResponse>{
        const inUse = await bag.game.isChannelStillInUse(data.channelId);

        return {
            success: true,
            inUse: inUse,
        };
    }
}