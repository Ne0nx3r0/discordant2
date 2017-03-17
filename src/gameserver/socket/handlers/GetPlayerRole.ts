import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface GetPlayerRoleRequest extends SocketRequest{
    uid: string;
    response?:GetPlayerRoleResponse;
}

export interface GetPlayerRoleResponse extends SocketResponse{
    role:string;
}

export default new SocketHandler('GetPlayerRole',async function(bag:SocketRequestHandlerBag,data:GetPlayerRoleRequest):Promise<GetPlayerRoleResponse>{
    const player:PlayerCharacter = await bag.game.getPlayerCharacter(data.uid);

    return {
        success: true,
        role: player ? player.role.title : 'anonymous'
    };
});