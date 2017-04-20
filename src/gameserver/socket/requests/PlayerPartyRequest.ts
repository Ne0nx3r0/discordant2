import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { SocketPlayerParty } from "../../../core/party/PlayerParty";

export interface PlayerPartyData extends ServerRequestData{
    uid: string;
}

export interface PlayerPartyResponse extends ServerResponse{
    party: SocketPlayerParty;
}

export default class PlayerPartyRequest extends ServerRequest{
    constructor(data:PlayerPartyData){
        super('PlayerParty',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<PlayerPartyResponse>{
        return await this._send(sioc) as PlayerPartyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:PlayerPartyData):Promise<PlayerPartyResponse>{
        const party = await bag.game.getPlayerParty(data.uid);

        return {
            success: true,
            party: party.toSocket()
        };
    }
}