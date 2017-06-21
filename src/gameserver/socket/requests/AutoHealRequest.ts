import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface AutoHealResults{
    vialsUsed: number;
    hpCurrent: number;
    hpTotal: number;
}

export interface AutoHealData extends ServerRequestData{
    uid: string;
}

export interface AutoHealResponse extends ServerResponse{
    results: AutoHealResults;
}

export default class AutoHealRequest extends ServerRequest{
    constructor(data:AutoHealData){
        super('AutoHeal',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<AutoHealResponse>{
        return await this._send(sioc) as AutoHealResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:AutoHealData):Promise<AutoHealResponse>{
        const results = await bag.game.autoHeal(data.uid);

        return {
            success: true,
            results: results,
        };
    }
}