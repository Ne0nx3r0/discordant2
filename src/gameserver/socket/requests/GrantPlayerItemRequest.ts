import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GrantPlayerItemData extends ServerRequestData{
    uid: string;
    itemId: number;
    amount: number;
}

export interface GrantPlayerItemResponse extends ServerResponse{
    amountLeft: number;
}

export default class GrantPlayerItemRequest extends ServerRequest{
    constructor(data:GrantPlayerItemData){
        super('GrantPlayerItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<number>{
        return (await this._send(sioc) as GrantPlayerItemResponse).amountLeft;
    }

    async receive(bag:ServerRequestReceiveBag,data:GrantPlayerItemData):Promise<GrantPlayerItemResponse>{
        const amountLeft = await bag.game.grantPlayerItem(data.uid,data.itemId,data.amount);

        return {
            success: true,
            amountLeft: amountLeft
        };
    }
}