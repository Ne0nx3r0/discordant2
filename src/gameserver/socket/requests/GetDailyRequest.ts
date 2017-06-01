import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GetDailyData extends ServerRequestData{
    uid: string;
}

export interface GetDailyResponse extends ServerResponse{
    message: string;
}

export default class GetDailyRequest extends ServerRequest{
    constructor(data:GetDailyData){
        super('GetDaily',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<GetDailyResponse>{
        return await this._send(sioc) as GetDailyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:GetDailyData):Promise<GetDailyResponse>{
        const message = await bag.game.getDaily(data.uid);

        return {
            success: true,
            message: message
        };
    }
}