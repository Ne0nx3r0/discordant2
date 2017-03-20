import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface SetPlayerRoleRequest extends SocketRequest{
    uid: string;
    role: string;
    response?:SetPlayerRoleResponse;
}

export interface SetPlayerRoleResponse extends SocketResponse{

}

export default new SocketHandler('SetPlayerRole',async function(bag:SocketRequestHandlerBag,data:SetPlayerRoleRequest):Promise<SetPlayerRoleResponse>{
    bag.game.setPlayerRole(data.uid,data.role);

    return {
        success: true,
    };
});