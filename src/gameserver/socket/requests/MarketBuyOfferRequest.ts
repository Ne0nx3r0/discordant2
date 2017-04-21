import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketMarketOffer } from "../../db/api/DBGetMarketOffer";
import { PurchasedMarketOffer } from '../../db/api/DBBuyMarketOffer';

export interface MarketBuyOfferData extends ServerRequestData{
    uid: string;
    offer: number;
    amount: number;
}

export interface MarketBuyOfferResponse extends ServerResponse{
    purchased: PurchasedMarketOffer;
}

export default class MarketBuyOfferRequest extends ServerRequest{
    constructor(data:MarketBuyOfferData){
        super('MarketBuyOffer',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<MarketBuyOfferResponse>{
        return await this._send(sioc) as MarketBuyOfferResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MarketBuyOfferData):Promise<MarketBuyOfferResponse>{
        const purchased = await bag.game.buyMarketOffer(data.uid,data.offer,data.amount);

        return {
            success: true,
            purchased: purchased,
        };
    }
}