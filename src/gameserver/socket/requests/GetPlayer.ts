import { ServerResponse, ServerRequestData, ServerRequestRunBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GetPlayerData extends ServerRequestData{
    uid: string;
}

export interface GetPlayerResponse extends ServerResponse{
    player:SocketPlayerCharacter;
}

export default class GetPlayer extends ServerRequest{
    data:GetPlayerData;

    constructor(data:GetPlayerData){
        super('GetPlayer',data);
    }

    async run(bag:ServerRequestRunBag):Promise<ServerResponse>{
        const player:PlayerCharacter = await bag.game.getPlayerCharacter(this.data.uid);

        return {
            success: true,
            player: player?player.toSocket():null,
        };
    }
}