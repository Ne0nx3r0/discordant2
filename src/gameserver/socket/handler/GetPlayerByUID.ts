import { GetPlayerByUIDResponse, GetPlayerByUIDRequest } from '../../../core/socket/SocketRequests';
import {SocketRequestHandlerBag} from '../SocketServer';

export default async function(bag:SocketRequestHandlerBag,data:GetPlayerByUIDRequest):Promise<GetPlayerByUIDResponse>{
    const pc = this.game.getPlayerCharacter(data.uid);

    return {
        success: true,
        player: pc.toSocket(),
    };
}