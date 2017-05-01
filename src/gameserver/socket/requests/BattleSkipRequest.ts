import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface BattleSkipData extends ServerRequestData{
    requesterUid: string;
    skipUid: string;
}

export interface BattleSkipResponse extends ServerResponse{

}

export default class BattleSkipRequest extends ServerRequest{
    constructor(data:BattleSkipData){
        super('BattleSkip',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as BattleSkipResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:BattleSkipData):Promise<BattleSkipResponse>{
        await bag.game.sendBattleSkip(data.requesterUid,data.skipUid);

        return {
            success: true,
        };
    }
}