import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface GetPlayerRequest extends SocketRequest{
    uid: string;
    response?:GetPlayerResponse;
}

export interface GetPlayerResponse extends SocketResponse{
    player:SocketPlayerCharacter;
}

export default new SocketHandler('GetPlayer',async function(bag:SocketRequestHandlerBag,data:GetPlayerRequest):Promise<GetPlayerResponse>{
    const player:PlayerCharacter = await bag.game.getPlayerCharacter(data.uid);

    return {
        success: true,
        player: player?player.toSocket():null,
    };
});