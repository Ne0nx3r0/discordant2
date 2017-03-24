import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GrantPlayerXPData extends ServerRequestData{
    uid: string;
    amount: number;
}

export interface GrantPlayerXPResponse extends ServerResponse{
    xpLeft:number;
}

export default class GrantPlayerXPRequest extends ServerRequest{
    constructor(data:GrantPlayerXPData){
        super('GrantPlayerXP',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<number>{
        return (await this._send(sioc) as GrantPlayerXPResponse).xpLeft;
    }

    async receive(bag:ServerRequestReceiveBag,data:GrantPlayerXPData):Promise<GrantPlayerXPResponse>{
        const xpLeft = await bag.game.grantPlayerXP(data.uid,data.amount);

        return {
            success: true,
            xpLeft: xpLeft,
        };
    }
}