import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketActiveMarketOffer } from "../../db/api/DBGetActiveMarketOffers";

export interface MarketUserOffersData extends ServerRequestData{
    uid: string;
}

export interface MarketUserOffersResponse extends ServerResponse{
    offers: Array<SocketActiveMarketOffer>;
}

export default class MarketUserOffersRequest extends ServerRequest{
    constructor(data:MarketUserOffersData){
        super('MarketUserOffers',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<MarketUserOffersResponse>{
        return await this._send(sioc) as MarketUserOffersResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MarketUserOffersData):Promise<MarketUserOffersResponse>{
        const offers = await bag.game.getUserOffers(data.uid);

        return {
            success: true,
            offers: offers,
        };
    }
}