import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface GrantPlayerWishesData extends ServerRequestData{
    uid: string;
    amount: number;
}

export interface GrantPlayerWishesResponse extends ServerResponse{
    wishesLeft:number;
}

export default class GrantPlayerWishesRequest extends ServerRequest{
    constructor(data:GrantPlayerWishesData){
        super('GrantPlayerWishes',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<number>{
        return (await this._send(sioc) as GrantPlayerWishesResponse).wishesLeft;
    }

    async receive(bag:ServerRequestReceiveBag,data:GrantPlayerWishesData):Promise<GrantPlayerWishesResponse>{
        const wishesLeft = await bag.game.grantPlayerWishes(data.uid,data.amount);

        return {
            success: true,
            wishesLeft: wishesLeft,
        };
    }
}