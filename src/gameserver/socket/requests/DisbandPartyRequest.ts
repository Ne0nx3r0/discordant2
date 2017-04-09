import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface DisbandPartyData extends ServerRequestData{
    uid: string;
}

export interface DisbandPartyResponse extends ServerResponse{

}

export default class DisbandPartyRequest extends ServerRequest{
    constructor(data:DisbandPartyData){
        super('DisbandParty',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as DisbandPartyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:DisbandPartyData):Promise<DisbandPartyResponse>{
        await bag.game.disbandParty(data.uid);

        return {
            success: true,
        };
    }
}