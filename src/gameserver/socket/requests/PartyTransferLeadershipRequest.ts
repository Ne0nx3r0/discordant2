import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface PartyTransferLeadershipData extends ServerRequestData{
    uid: string;
    newLeaderUid: string;
}

export interface PartyTransferLeadershipResponse extends ServerResponse{

}

export default class PartyTransferLeadershipRequest extends ServerRequest{
    constructor(data:PartyTransferLeadershipData){
        super('PartyTransferLeadership',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as PartyTransferLeadershipResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:PartyTransferLeadershipData):Promise<PartyTransferLeadershipResponse>{
        await bag.game.transferPartyLeadership(data.uid,data.newLeaderUid);

        return {
            success: true,
        };
    }
}