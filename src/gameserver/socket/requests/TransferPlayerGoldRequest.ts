import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface TransferPlayerGoldData extends ServerRequestData{
    from:string;
    to:string;
    amount:number;
}

export interface TransferPlayerGoldResponse extends ServerResponse{

}

export default class TransferPlayerGoldRequest extends ServerRequest{
    constructor(data:TransferPlayerGoldData){
        super('TransferPlayerGold',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as TransferPlayerGoldResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:TransferPlayerGoldData):Promise<TransferPlayerGoldResponse>{
        await bag.game.transferPlayerGold(data.from,data.to,data.amount);

        return {
            success: true,
        };
    }
}