import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface BattleChargeData extends ServerRequestData{
    uid: string;
}

export interface BattleChargeResponse extends ServerResponse{

}

export default class BattleChargeRequest extends ServerRequest{
    constructor(data:BattleChargeData){
        super('BattleCharge',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as BattleChargeResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:BattleChargeData):Promise<BattleChargeResponse>{
        await bag.game.sendBattleCharge(data.uid);

        return {
            success: true,
        };
    }
}