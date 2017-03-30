import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface BattleBlockData extends ServerRequestData{
    uid: string;
}

export interface BattleBlockResponse extends ServerResponse{

}

export default class BattleBlockRequest extends ServerRequest{
    constructor(data:BattleBlockData){
        super('BattleBlock',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as BattleBlockResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:BattleBlockData):Promise<BattleBlockResponse>{
        await bag.game.sendBattleBlock(data.uid);

        return {
            success: true,
        };
    }
}