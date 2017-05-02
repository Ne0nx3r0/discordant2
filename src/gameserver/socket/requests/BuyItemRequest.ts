import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface BuyItemData extends ServerRequestData{
    uid: string;
    item: number;
    amount: number;
}

export interface BuyItemResponse extends ServerResponse{

}

export default class BuyItemRequest extends ServerRequest{
    constructor(data:BuyItemData){
        super('BuyItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as BuyItemResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:BuyItemData):Promise<BuyItemResponse>{
        await bag.game.buyItem(data.uid,data.item,data.amount);

        return {
            success: true,
        };
    }
}