import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import InventoryItem from '../../../core/item/InventoryItem';

export interface MarketStopData extends ServerRequestData{
    uid: string;
    offer: number;
}

export interface MarketStopResponse extends ServerResponse{
    item: number;
    amount: number;
}

export default class MarketStopRequest extends ServerRequest{
    constructor(data:MarketStopData){
        super('MarketStop',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<MarketStopResponse>{
        return await this._send(sioc) as MarketStopResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MarketStopData):Promise<MarketStopResponse>{
        const inventoryItemReturned:InventoryItem = await bag.game.marketStopItem(data.uid,data.offer);

        return {
            item: inventoryItemReturned.base.id,
            amount: inventoryItemReturned.amount,
            success: true,
        };
    }
}