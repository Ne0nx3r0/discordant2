import { GetPlayerByUIDResponse, GetPlayerByUIDRequest } from '../../../core/socket/SocketRequests';
import {SocketRequestHandlerBag} from '../SocketServer';

export default async function(bag:SocketRequestHandlerBag,data:GetPlayerByUIDRequest):Promise<GetPlayerByUIDResponse>{
    return {
        success: true,
        player: await bag.game.getPlayerCharacter(data.uid)
    };
}