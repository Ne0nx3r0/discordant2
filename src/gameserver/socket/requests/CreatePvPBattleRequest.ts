import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface CreatePvPBattleData extends ServerRequestData{
    player1: string;
    player2: string;
}

export interface CreatePvPBattleResponse extends ServerResponse{

}

export default class CreatePvPBattleRequest extends ServerRequest{
    constructor(data:CreatePvPBattleData){
        super('CreatePvPBattle',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as CreatePvPBattleResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:CreatePvPBattleData):Promise<CreatePvPBattleResponse>{
        await bag.game.createPvPBattle(data.player1,data.player2);

        return {
            success: true,
        };
    }
}