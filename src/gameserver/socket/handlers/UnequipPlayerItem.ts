import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';

export interface UnequipPlayerItemRequest extends SocketRequest{
    uid: string;
    slot: EquipmentSlot;
    response?: EquipPlayerItemResponse;
}

export interface EquipPlayerItemResponse extends SocketResponse{
    unequipped: number;
}

const EquipPlayerItem = new SocketHandler('UnequipPlayerItem',async function(bag:SocketRequestHandlerBag,data:UnequipPlayerItemRequest):Promise<EquipPlayerItemResponse>{
    const unequippedItem = await bag.game.unequipPlayerItem(data.uid,data.slot);

    return {
        success: true,
        unequipped: unequippedItem,
    };
});

export default EquipPlayerItem;