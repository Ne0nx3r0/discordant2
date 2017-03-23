import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GetPlayerRoleData extends ServerRequestData{
    uid: string;
}

export interface GetPlayerRoleResponse extends ServerResponse{
    role:string;
}

export default class GetPlayerRoleRequest extends ServerRequest{
    constructor(data:GetPlayerRoleData){
        super('GetPlayerRole',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<string>{
        return (await this._send(sioc) as GetPlayerRoleResponse).role;
    }

    async receive(bag:ServerRequestReceiveBag,data:GetPlayerRoleData):Promise<GetPlayerRoleResponse>{
        const player:PlayerCharacter = await bag.game.getPlayerCharacter(data.uid);

        return {
            success: true,
            role: player ? player.role.title : 'anonymous'
        };
    }
}