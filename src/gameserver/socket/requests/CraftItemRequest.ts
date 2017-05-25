import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface CraftItemData extends ServerRequestData{
    uid: string;
    item: number;
    amount: number;
}

export interface CraftItemResponse extends ServerResponse{

}

export default class CraftItemRequest extends ServerRequest{
    constructor(data:CraftItemData){
        super('CraftItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as CraftItemResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:CraftItemData):Promise<CraftItemResponse>{
        await bag.game.craftItem(data.uid,data.item,data.amount);

        return {
            success: true,
        };
    }
}