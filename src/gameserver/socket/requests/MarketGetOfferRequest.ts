import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketMarketOffer } from "../../db/api/DBGetMarketOffer";

export interface MarketGetOfferData extends ServerRequestData{
    offer: number;
}

export interface MarketGetOfferResponse extends ServerResponse{
    offer: SocketMarketOffer;
}

export default class MarketGetOfferRequest extends ServerRequest{
    constructor(data:MarketGetOfferData){
        super('MarketGetOffer',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<MarketGetOfferResponse>{
        return await this._send(sioc) as MarketGetOfferResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MarketGetOfferData):Promise<MarketGetOfferResponse>{
        const offer = await bag.game.getMarketOffer(data.offer);

        return {
            success: true,
            offer: offer,
        };
    }
}