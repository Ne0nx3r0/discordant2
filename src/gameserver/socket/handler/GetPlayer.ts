import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketRequest, SocketResponse } from '../../../core/socket/SocketRequests';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';

export interface GetPlayerRequest extends SocketRequest{
    uid: string;
    response?:GetPlayerResponse;
}

export interface GetPlayerResponse extends SocketResponse{
    player:SocketPlayerCharacter;
}

export default async function(bag:SocketRequestHandlerBag,data:GetPlayerRequest):Promise<GetPlayerResponse>{
    const player = await bag.game.getPlayerCharacter(data.uid);

    return {
        success: true,
        player: player.toSocket(),
    };
}