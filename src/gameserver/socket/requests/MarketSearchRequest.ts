import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketActiveMarketOffer } from "../../db/api/DBGetActiveMarketOffers";

export interface MarketSearchData extends ServerRequestData{
    item: number;
}

export interface MarketSearchResponse extends ServerResponse{
    offers: Array<SocketActiveMarketOffer>;
}

export default class MarketSearchRequest extends ServerRequest{
    constructor(data:MarketSearchData){
        super('MarketSearch',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<MarketSearchResponse>{
        return await this._send(sioc) as MarketSearchResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MarketSearchData):Promise<MarketSearchResponse>{
        const offers = await bag.game.getActiveMarketOffers(data.item);

        return {
            success: true,
            offers: offers,
        };
    }
}