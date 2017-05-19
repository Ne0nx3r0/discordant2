import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { LeadPlayerOption } from '../../../bot/commands/Lead';

export interface GetTopPlayersData extends ServerRequestData{
    type: LeadPlayerOption;
}

export interface ITopPlayer{
    title: string,
    amount: string
}

export interface GetTopPlayersResponse extends ServerResponse{
    players: Array<ITopPlayer>;
}

export default class GetTopPlayersRequest extends ServerRequest{
    constructor(data:GetTopPlayersData){
        super('GetTopPlayers',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<GetTopPlayersResponse>{
        return await this._send(sioc) as GetTopPlayersResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:GetTopPlayersData):Promise<GetTopPlayersResponse>{
        const players = await bag.game.getTopPlayers(data.type);

        return {
            success: true,
            players: players,
        };
    }
}