import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface EquipPlayerItemData extends ServerRequestData{
    uid: string;
    itemId: number;
    offhand: boolean;
}

export interface EquipPlayerItemResponse extends ServerResponse{
    unequipped: number;
}

export default class EquipPlayerItemRequest extends ServerRequest{
    constructor(data:EquipPlayerItemData){
        super('EquipPlayerItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<number>{
        return (await this._send(sioc) as EquipPlayerItemResponse).unequipped;
    }

    async receive(bag:ServerRequestReceiveBag,data:EquipPlayerItemData):Promise<EquipPlayerItemResponse>{
        const unequippedItem = await bag.game.equipPlayerItem(data.uid,data.itemId,data.offhand);

        return {
            success: true,
            unequipped: unequippedItem,
        };
    }
}