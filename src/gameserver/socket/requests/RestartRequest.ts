import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface RestartData extends ServerRequestData{
}

export interface RestartResponse extends ServerResponse{

}

export default class RestartRequest extends ServerRequest{
    constructor(data:RestartData){
        super('Restart',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as RestartResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:RestartData):Promise<RestartResponse>{
        setTimeout(function(){
            process.exit();
        },500);

        return {
            success: true,
        };
    }
}