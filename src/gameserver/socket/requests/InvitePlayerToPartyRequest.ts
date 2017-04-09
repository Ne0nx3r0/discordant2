import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface InvitePlayerToPartyData extends ServerRequestData{
    uid: string;
    invitedUid: string;
}

export interface InvitePlayerToPartyResponse extends ServerResponse{

}

export default class InvitePlayerToPartyRequest extends ServerRequest{
    constructor(data:InvitePlayerToPartyData){
        super('InvitePlayerToParty',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as InvitePlayerToPartyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:InvitePlayerToPartyData):Promise<InvitePlayerToPartyResponse>{
        bag.game.invitePlayerToParty(data.uid,data.invitedUid);

        return {
            success: true,
        };
    }
}