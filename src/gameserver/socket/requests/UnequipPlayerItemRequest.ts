import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';

export interface UnequipPlayerItemData extends ServerRequestData{
    uid: string;
    slot: EquipmentSlot;
}

export interface UnequipPlayerItemResponse extends ServerResponse{
    unequipped: number;
}

export default class UnequipPlayerItemRequest extends ServerRequest{
    constructor(data:UnequipPlayerItemData){
        super('UnequipPlayerItem',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<number>{
        return (await this._send(sioc) as UnequipPlayerItemResponse).unequipped;
    }

    async receive(bag:ServerRequestReceiveBag,data:UnequipPlayerItemData):Promise<UnequipPlayerItemResponse>{
        const unequippedItem = await bag.game.unequipPlayerItem(data.uid,data.slot);

        return {
            success: true,
            unequipped: unequippedItem,
        };
    }
}