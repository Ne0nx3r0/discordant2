import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface PartyKickPlayerData extends ServerRequestData{
    uid: string;
    kickUid: string;
}

export interface PartyKickPlayerResponse extends ServerResponse{

}

export default class PartyKickPlayerRequest extends ServerRequest{
    constructor(data:PartyKickPlayerData){
        super('PartyKickPlayer',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as PartyKickPlayerResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:PartyKickPlayerData):Promise<PartyKickPlayerResponse>{
        await bag.game.kickPlayerFromParty(data.uid,data.kickUid);

        return {
            success: true,
        };
    }
}