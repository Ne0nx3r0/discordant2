import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface TransferPlayerItemData extends ServerRequestData{
    fromUid: string;
    toUid: string;
    itemId: number;
    amount: number;
}

export interface TransferPlayerItemResponse extends ServerResponse{
}

export default class TransferPlayerItemRequest extends ServerRequest{
    constructor(data:TransferPlayerItemData){
        super('TransferPlayerItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc);
    }

    async receive(bag:ServerRequestReceiveBag,data:TransferPlayerItemData):Promise<TransferPlayerItemResponse>{
        await bag.game.transferPlayerItem(data.fromUid,data.toUid,data.itemId,data.amount);

        return {
            success: true
        };
    }
}