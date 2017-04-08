import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface SetSliceRemoteUrlData extends ServerRequestData{
    imageSrc: string;
    remoteUrl: string;
}

export interface SetSliceRemoteUrlResponse extends ServerResponse{

}

export default class SetSliceRemoteUrlRequest extends ServerRequest{
    constructor(data:SetSliceRemoteUrlData){
        super('SetSliceRemoteUrl',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as SetSliceRemoteUrlResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:SetSliceRemoteUrlData):Promise<SetSliceRemoteUrlResponse>{
        bag.game.setSliceRemoteUrl(data.imageSrc,data.remoteUrl);

        return {
            success: true,
        };
    }
}