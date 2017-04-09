import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface AcceptPartyInvitationData extends ServerRequestData{
    uid: string;
}

export interface AcceptPartyInvitationResponse extends ServerResponse{

}

export default class AcceptPartyInvitationRequest extends ServerRequest{
    constructor(data:AcceptPartyInvitationData){
        super('AcceptPartyInvitation',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as AcceptPartyInvitationResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:AcceptPartyInvitationData):Promise<AcceptPartyInvitationResponse>{
        await bag.game.acceptPartyInvitation(data.uid);

        return {
            success: true,
        };
    }
}