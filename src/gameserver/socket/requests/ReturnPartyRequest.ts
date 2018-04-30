import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface ReturnPartyData extends ServerRequestData{
    uid: string;
}

export interface ReturnPartyResponse extends ServerResponse{

}

export default class ReturnPartyRequest extends ServerRequest{
    constructor(data:ReturnPartyData){
        super('ReturnParty',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as ReturnPartyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:ReturnPartyData):Promise<ReturnPartyResponse>{
        await bag.game.returnParty(data.uid);

        return {
            success: true,
        };
    }
}