import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface EquipPlayerItemRequest extends SocketRequest{
    uid: string;
    itemId: number;
    offhand: boolean;
    response?: EquipPlayerItemResponse;
}

export interface EquipPlayerItemResponse extends SocketResponse{
    unequipped: number;
}

const EquipPlayerItem = new SocketHandler('EquipPlayerItem',async function(bag:SocketRequestHandlerBag,data:EquipPlayerItemRequest):Promise<EquipPlayerItemResponse>{
    const unequippedItem = await bag.game.equipPlayerItem(data.uid,data.itemId,data.offhand);

    return {
        success: true,
        unequipped: unequippedItem,
    };
});

export default EquipPlayerItem;