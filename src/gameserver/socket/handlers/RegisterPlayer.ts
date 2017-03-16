import {SocketRequestHandlerBag} from '../SocketServer';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketResponse, SocketRequest } from '../SocketHandler';

export interface RegisterPlayerRequest extends SocketRequest{
    uid: string;
    classId: number;
    username: string;
    discriminator: number;
    response?:RegisterPlayerResponse;
}

export interface RegisterPlayerResponse extends SocketResponse{
    player:SocketPlayerCharacter;
}

export default new SocketHandler('RegisterPlayer',async function(bag:SocketRequestHandlerBag,data:RegisterPlayerRequest):Promise<RegisterPlayerResponse>{
    const player:PlayerCharacter = await bag.game.registerPlayerCharacter({
        uid: data.uid,
        classId: data.classId,
        username: data.username,
        discriminator: data.discriminator,
    });

    return {
        success: true,
        player: player?player.toSocket():null,
    };
});