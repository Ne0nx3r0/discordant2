import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GetPlayerData extends ServerRequestData{
    uid: string;
}

export interface GetPlayerResponse extends ServerResponse{
    player:SocketPlayerCharacter;
}

export default class GetPlayerRequest extends ServerRequest{
    constructor(playerUID:string){
        super('GetPlayer',{
            uid:playerUID
        });
    }

    async send(sioc:SocketIOClient.Socket):Promise<SocketPlayerCharacter>{
        return (await this._send(sioc) as GetPlayerResponse).player;
    }

    async receive(bag:ServerRequestReceiveBag,data:GetPlayerData):Promise<GetPlayerResponse>{
        const player:PlayerCharacter = await bag.game.getPlayerCharacter(data.uid);

        return {
            success: true,
            player: player.toSocket()
        };
    }
}