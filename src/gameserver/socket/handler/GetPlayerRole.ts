import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketRequest, SocketResponse } from '../../../core/socket/SocketRequests';

export interface GetPlayerRoleRequest extends SocketRequest{
    uid: string;
    response?:GetPlayerRoleResponse;
}

export interface GetPlayerRoleResponse extends SocketResponse{
    role:string;
}

export default async function(bag:SocketRequestHandlerBag,data:GetPlayerRoleRequest):Promise<GetPlayerRoleResponse>{
    const pc = await bag.game.getPlayerCharacter(data.uid);

    return {
        success: true,
        role: pc.role.title,
    };
}