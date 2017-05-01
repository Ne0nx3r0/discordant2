import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface BattleRunData extends ServerRequestData{
    uid: string;
}

export interface BattleRunResponse extends ServerResponse{

}

export default class BattleRunRequest extends ServerRequest{
    constructor(data:BattleRunData){
        super('BattleRun',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as BattleRunResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:BattleRunData):Promise<BattleRunResponse>{
        await bag.game.sendBattleRun(data.uid);

        return {
            success: true,
        };
    }
}