import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface SendPartyMapImageData extends ServerRequestData{
    uid: string;
}

export interface SendPartyMapImageResponse extends ServerResponse{

}

export default class SendPartyMapImageRequest extends ServerRequest{
    constructor(data:SendPartyMapImageData){
        super('SendPartyMapImage',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as SendPartyMapImageResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:SendPartyMapImageData):Promise<SendPartyMapImageResponse>{
        await bag.game.sendPartyMapImage(data.uid);

        return {
            success: true,
        };
    }
}