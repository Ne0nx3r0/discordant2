import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface ConvertWishesToGoldData extends ServerRequestData{
    uid: string;
    amount: number;
}

export interface ConvertWishesToGoldResponse extends ServerResponse{
    goldGained:number;
    goldTotal:number;
}

export default class ConvertWishesToGoldRequest extends ServerRequest{
    constructor(data:ConvertWishesToGoldData){
        super('ConvertWishesToGold',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<ConvertWishesToGoldResponse>{
        return await this._send(sioc) as ConvertWishesToGoldResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:ConvertWishesToGoldData):Promise<ConvertWishesToGoldResponse>{
        const golds = await bag.game.convertWishesToGold(data.uid,data.amount);

        return {
            success: true,
            goldGained: golds[0],
            goldTotal: golds[1],
        };
    }
}