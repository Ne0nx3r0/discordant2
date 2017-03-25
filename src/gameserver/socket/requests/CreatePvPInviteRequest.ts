import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface CreatePvPInviteData extends ServerRequestData{
    sender: string;
    receiver: string;
}

export interface CreatePvPInviteResponse extends ServerResponse{

}

export default class CreatePvPInviteRequest extends ServerRequest{
    constructor(data:CreatePvPInviteData){
        super('CreatePvPInvite',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as CreatePvPInviteResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:CreatePvPInviteData):Promise<CreatePvPInviteResponse>{
        bag.game.createPvPInvite(sender,receiver);

        return {
            success: true,
        };
    }
}