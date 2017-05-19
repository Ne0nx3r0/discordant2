import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export type WishType = 'strength' | 'agility'| 'vitality'| 'spirit' | 'luck';

export interface LevelUpData extends ServerRequestData{
    uid: string;
    wishType: WishType;
}

export interface LevelUpResponse extends ServerResponse{
    player: SocketPlayerCharacter;
}

export default class LevelUpRequest extends ServerRequest{
    constructor(data:LevelUpData){
        super('LevelUp',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<LevelUpResponse>{
        return await this._send(sioc) as LevelUpResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:LevelUpData):Promise<LevelUpResponse>{
        const pc = await bag.game.levelUp(data.uid,data.wishType);

        return {
            success: true,
            player: pc.toSocket() 
        };
    }
}