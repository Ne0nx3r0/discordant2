import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface SetPlayerDescriptionData extends ServerRequestData{
    uid: string;
    description: string;
}

export interface SetPlayerDescriptionResponse extends ServerResponse{

}

export default class SetPlayerDescriptionRequest extends ServerRequest{
    constructor(data:SetPlayerDescriptionData){
        super('SetPlayerDescription',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as SetPlayerDescriptionResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:SetPlayerDescriptionData):Promise<SetPlayerDescriptionResponse>{
        await bag.game.setPlayerDescription(data.uid,data.description);

        return {
            success: true,
        };
    }
}