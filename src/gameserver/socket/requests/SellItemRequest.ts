import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface SellItemData extends ServerRequestData{
    uid: string;
    item: number;
    amount: number;
}

export interface SellItemResponse extends ServerResponse{

}

export default class SellItemRequest extends ServerRequest{
    constructor(data:SellItemData){
        super('SellItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as SellItemResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:SellItemData):Promise<SellItemResponse>{
        await bag.game.sellItem(data.uid,data.item,data.amount);

        return {
            success: true,
        };
    }
}