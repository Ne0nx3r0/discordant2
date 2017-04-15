import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GrantPlayerGoldData extends ServerRequestData{
    uid: string;
    amount: number;
}

export interface GrantPlayerGoldResponse extends ServerResponse{
    goldLeft:number;
}

export default class GrantPlayerGoldRequest extends ServerRequest{
    constructor(data:GrantPlayerGoldData){
        super('GrantPlayerGold',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<number>{
        return (await this._send(sioc) as GrantPlayerGoldResponse).goldLeft;
    }

    async receive(bag:ServerRequestReceiveBag,data:GrantPlayerGoldData):Promise<GrantPlayerGoldResponse>{
        const goldLeft = await bag.game.grantPlayerGold(data.uid,data.amount);

        return {
            success: true,
            goldLeft: goldLeft,
        };
    }
}