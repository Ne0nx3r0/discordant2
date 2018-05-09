import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface RespecPlayerData extends ServerRequestData{
    uid: string;
}

export interface RespecPlayerResponse extends ServerResponse{
    msg: string;
}

export default class RespecPlayerRequest extends ServerRequest{
    constructor(data:RespecPlayerData){
        super('RespecPlayer',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<string>{
        return (await this._send(sioc) as RespecPlayerResponse).msg;
    }

    async receive(bag:ServerRequestReceiveBag,data:RespecPlayerData):Promise<RespecPlayerResponse>{
        const msg = await bag.game.respecPlayer(data.uid);

        return {
            success: true,
            msg,
        };
    }
}