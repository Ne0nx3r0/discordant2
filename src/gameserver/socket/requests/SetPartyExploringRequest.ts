import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface SetPartyExploringData extends ServerRequestData{
    uid: string;
}

export interface SetPartyExploringResponse extends ServerResponse{

}

export default class SetPartyExploringRequest extends ServerRequest{
    constructor(data:SetPartyExploringData){
        super('SetPartyExploring',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as SetPartyExploringResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:SetPartyExploringData):Promise<SetPartyExploringResponse>{
        await bag.game.setPartyExploring(data.uid);

        return {
            success: true,
        };
    }
}