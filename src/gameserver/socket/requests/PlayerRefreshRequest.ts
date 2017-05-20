import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface PlayerRefreshData extends ServerRequestData{
    uid: string;
}

export interface PlayerRefreshResponse extends ServerResponse{

}

export default class PlayerRefreshRequest extends ServerRequest{
    constructor(data:PlayerRefreshData){
        super('PlayerRefresh',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as PlayerRefreshResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:PlayerRefreshData):Promise<PlayerRefreshResponse>{
        await bag.game.refreshPlayer(data.uid);

        return {
            success: true,
        };
    }
}