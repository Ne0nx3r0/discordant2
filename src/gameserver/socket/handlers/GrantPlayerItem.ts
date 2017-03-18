import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface GrantPlayerItemRequest extends SocketRequest{
    uid: string;
    itemId: number;
    amount: number;
    response?: GrantPlayerItemResponse;
}

export interface GrantPlayerItemResponse extends SocketResponse{
    amountLeft: number;
}

const GrantPlayerItem = new SocketHandler('GrantPlayerItem',async function(bag:SocketRequestHandlerBag,data:GrantPlayerItemRequest):Promise<GrantPlayerItemResponse>{
    const amountLeft = await bag.game.grantPlayerItem(data.uid,data.itemId,data.amount);

    return {
        success: true,
        amountLeft: amountLeft
    };
});

export default GrantPlayerItem;