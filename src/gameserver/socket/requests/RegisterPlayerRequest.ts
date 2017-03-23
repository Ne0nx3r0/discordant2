import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface RegisterPlayerData extends ServerRequestData{
    uid: string;
    classId: number;
    username: string;
    discriminator: string;
}

export interface RegisterPlayerResponse extends ServerResponse{
    player:SocketPlayerCharacter;
}

export default class RegisterPlayerRequest extends ServerRequest{
    constructor(data:RegisterPlayerData){
        super('RegisterPlayer',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<SocketPlayerCharacter>{
        return (await this._send(sioc) as RegisterPlayerResponse).player;
    }

    async receive(bag:ServerRequestReceiveBag,data:RegisterPlayerData):Promise<RegisterPlayerResponse>{
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
    }
}