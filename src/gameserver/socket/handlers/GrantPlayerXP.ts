import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface GrantPlayerXPRequest extends SocketRequest{
    uid: string;
    amount: number;
    response?:GrantPlayerXPResponse;
}

export interface GrantPlayerXPResponse extends SocketResponse{
    xpLeft:number;
}

const GrantPlayerXP = new SocketHandler('GrantPlayerXP',async function(bag:SocketRequestHandlerBag,data:GrantPlayerXPRequest):Promise<GrantPlayerXPResponse>{
    const xpLeft = await bag.game.grantPlayerXP(data.uid,data.amount);

    return {
        success: true,
        xpLeft: xpLeft,
    };
});

export default GrantPlayerXP;