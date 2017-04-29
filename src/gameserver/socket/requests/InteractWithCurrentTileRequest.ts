import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface InteractWithCurrentTileData extends ServerRequestData{
    uid: string;
}

export interface InteractWithCurrentTileResponse extends ServerResponse{

}

export default class InteractWithCurrentTileRequest extends ServerRequest{
    constructor(data:InteractWithCurrentTileData){
        super('InteractWithCurrentTile',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as InteractWithCurrentTileResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:InteractWithCurrentTileData):Promise<InteractWithCurrentTileResponse>{
        await bag.game.interactWithCurrentTile(data.uid);

        return {
            success: true,
        };
    }
}