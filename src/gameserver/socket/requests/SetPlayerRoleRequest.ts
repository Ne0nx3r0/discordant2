import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface SetPlayerRoleData extends ServerRequestData{
    uid: string;
    role: string;
}

export interface SetPlayerRoleResponse extends ServerResponse{

}

export default class SetPlayerRoleRequest extends ServerRequest{
    constructor(data:SetPlayerRoleData){
        super('SetPlayerRole',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as SetPlayerRoleResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:SetPlayerRoleData):Promise<SetPlayerRoleResponse>{
        bag.game.setPlayerRole(data.uid,data.role);

        return {
            success: true,
        };
    }
}