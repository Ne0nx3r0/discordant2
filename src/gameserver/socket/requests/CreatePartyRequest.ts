import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface CreatePartyData extends ServerRequestData{
    leader: string;
    channel: string;
}

export interface CreatePartyResponse extends ServerResponse{

}

export default class CreatePartyRequest extends ServerRequest{
    constructor(data:CreatePartyData){
        super('CreateParty',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as CreatePartyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:CreatePartyData):Promise<CreatePartyResponse>{
        await bag.game.createParty(data.leader,data.channel);

        return {
            success: true,
        };
    }
}