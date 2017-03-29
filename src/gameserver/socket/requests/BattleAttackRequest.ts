import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

export interface BattleAttackData extends ServerRequestData{
    uid: string;
    attackTitle:string;
    offhand:boolean;
}

export interface BattleAttackResponse extends ServerResponse{

}

export default class BattleAttackRequest extends ServerRequest{
    constructor(data:BattleAttackData){
        super('BattleAttack',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as BattleAttackResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:BattleAttackData):Promise<BattleAttackResponse>{
        bag.game.sendBattleAttack(data.uid,data.attackTitle,data.offhand);

        return {
            success: true,
        };
    }
}