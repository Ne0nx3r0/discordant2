import { ServerResponse, ServerRequestData, ServerRequestRunBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GetPlayerRoleData extends ServerRequestData{
    uid: string;
}

export interface GetPlayerRoleResponse extends ServerResponse{
    role:string;
}

export default class GetPlayerRole extends ServerRequest{
    data:GetPlayerRoleData;

    constructor(playerUID:string){
        super('GetPlayerRole',{
            uid:playerUID
        });
    }

    send(sioc:SocketIOClient.Socket):Promise<GetPlayerRoleResponse>{
        return this._send(sioc);
    }

    async receive(bag:ServerRequestRunBag):Promise<GetPlayerRoleResponse>{
        const player:PlayerCharacter = await bag.game.getPlayerCharacter(this.data.uid);

        return {
            success: true,
            role: player ? player.role.title : 'anonymous'
        };
    }
}