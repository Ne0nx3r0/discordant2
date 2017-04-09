import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import DisbandPartyRequest from './DisbandPartyRequest';
import { PartyMoveDirection } from "../../../core/party/PartyExploringMap";

export interface MovePartyData extends ServerRequestData{
    uid: string;
    direction: PartyMoveDirection;
}

export interface MovePartyResponse extends ServerResponse{

}

export default class MovePartyRequest extends ServerRequest{
    constructor(data:MovePartyData){
        super('MoveParty',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as MovePartyResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:MovePartyData):Promise<MovePartyResponse>{
        await bag.game.moveParty(data.uid,data.direction);

        return {
            success: true,
        };
    }
}