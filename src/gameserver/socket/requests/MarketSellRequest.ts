import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface MarketSellData extends ServerRequestData{
    uid: string;
    item: number;
    amount: number;
    price: number;
}

export interface MarketSellResponse extends ServerResponse{
    offer: string;
}

export default class MarketSellRequest extends ServerRequest{
    constructor(data:MarketSellData){
        super('MarketSell',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<MarketSellResponse>{
        return await this._send(sioc) as MarketSellResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MarketSellData):Promise<MarketSellResponse>{
        const offerId = await bag.game.marketSellItem(data);

        return {
            offer: offerId,
            success: true,
        };
    }
}