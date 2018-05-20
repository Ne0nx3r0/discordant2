import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface BuyStallData extends ServerRequestData{
    uid: string;
}

export interface BuyStallResponse extends ServerResponse{
    newStallCount:number;
}

export default class BuyStallRequest extends ServerRequest{
    constructor(data:BuyStallData){
        super('BuyStall',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<number>{
        const result = await this._send(sioc) as BuyStallResponse;

        return result.newStallCount;
    }

    async receive(bag:ServerRequestReceiveBag,data:BuyStallData):Promise<BuyStallResponse>{
        const newStallCount = await bag.game.buyStableStall(data.uid);

        return {
            success: true,
            newStallCount,
        };
    }
}