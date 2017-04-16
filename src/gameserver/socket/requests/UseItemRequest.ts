import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface UseItemData extends ServerRequestData{
    uid: string;
    item: number;
}

export interface UseItemResponse extends ServerResponse{
    message: string;
}

export default class UseItemRequest extends ServerRequest{
    constructor(data:UseItemData){
        super('UseItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<UseItemResponse>{
        return await this._send(sioc) as UseItemResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:UseItemData):Promise<UseItemResponse>{
        const message = await bag.game.useItem(data.uid,data.item);

        return {
            success: true,
            message: message,
        };
    }
}