import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface GrantPlayerWishesRequest extends SocketRequest{
    uid: string;
    amount: number;
    response?:GrantPlayerWishesResponse;
}

export interface GrantPlayerWishesResponse extends SocketResponse{
    wishesLeft:number;
}

const GrantPlayerWishes = new SocketHandler('GrantPlayerWishes',async function(bag:SocketRequestHandlerBag,data:GrantPlayerWishesRequest):Promise<GrantPlayerWishesResponse>{
    const wishesLeft = await bag.game.grantPlayerWishes(data.uid,data.amount);

    return {
        success: true,
        wishesLeft: wishesLeft,
    };
});

export default GrantPlayerWishes;