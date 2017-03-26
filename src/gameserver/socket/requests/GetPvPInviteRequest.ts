import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketPvPInvite } from '../../../core/battle/PvPInvite';

export interface GetPvPInviteData extends ServerRequestData{
    participant: string;
}

export interface GetPvPInviteResponse extends ServerResponse{
    invite: SocketPvPInvite;
}

export default class GetPvPInviteRequest extends ServerRequest{
    constructor(data:GetPvPInviteData){
        super('GetPvPInvite',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<SocketPvPInvite>{
        return (await this._send(sioc) as GetPvPInviteResponse).invite;
    }

    async receive(bag:ServerRequestReceiveBag,data:GetPvPInviteData):Promise<GetPvPInviteResponse>{
        const invite = await bag.game.getPvPInvite(data.participant);

        return {
            success: true,
            invite: {
                sender: invite.sender.toSocket(),
                receiver: invite.receiver.toSocket()
            }
        };
    }
}