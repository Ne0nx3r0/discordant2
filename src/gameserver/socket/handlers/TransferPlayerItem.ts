import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface TransferPlayerItemRequest extends SocketRequest{
    fromUid: string;
    toUid: string;
    itemId: number;
    amount: number;
    response?: TransferPlayerItemResponse;
}

export interface TransferPlayerItemResponse extends SocketResponse{
}

const TransferPlayerItem = new SocketHandler('TransferPlayerItem',async function(bag:SocketRequestHandlerBag,data:TransferPlayerItemRequest):Promise<TransferPlayerItemResponse>{
    await bag.game.transferPlayerItem(data.fromUid,data.toUid,data.itemId,data.amount);

    return {
        success: true
    };
});

export default TransferPlayerItem;