import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface DeclinePartyInvitationData extends ServerRequestData{
    uid: string;
}

export interface DeclinePartyInvitationResponse extends ServerResponse{

}

export default class DeclinePartyInvitationRequest extends ServerRequest{
    constructor(data:DeclinePartyInvitationData){
        super('DeclinePartyInvitation',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as DeclinePartyInvitationResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:DeclinePartyInvitationData):Promise<DeclinePartyInvitationResponse>{
        await bag.game.declinePartyInvitation(data.uid);

        return {
            success: true,
        };
    }
}