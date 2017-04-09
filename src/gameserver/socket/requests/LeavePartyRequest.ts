import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface LeavePartyData extends ServerRequestData{
    uid: string;
}

export interface LeavePartyResponse extends ServerResponse{

}

export default class LeavePartyRequest extends ServerRequest{
    constructor(data:LeavePartyData){
        super('LeaveParty',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as LeavePartyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:LeavePartyData):Promise<LeavePartyResponse>{
        await bag.game.leaveParty(data.uid);

        return {
            success: true,
        };
    }
}