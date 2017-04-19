import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketActiveMarketOffer } from "../../db/api/DBGetActiveMarketOffers";

export interface MarketNewOffersData extends ServerRequestData{
    page: number;
}

export interface MarketNewOffersResponse extends ServerResponse{
    offers: Array<SocketActiveMarketOffer>;
}

export default class MarketNewOffersRequest extends ServerRequest{
    constructor(data:MarketNewOffersData){
        super('MarketNewOffers',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<MarketNewOffersResponse>{
        return await this._send(sioc) as MarketNewOffersResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MarketNewOffersData):Promise<MarketNewOffersResponse>{
        const offers = await bag.game.getNewestActiveMarketOffers(data.page);

        return {
            success: true,
            offers: offers,
        };
    }
}