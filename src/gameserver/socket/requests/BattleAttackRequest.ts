import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';

interface BattleAttackRequestBase extends ServerRequestData{
    uid: string;
    attackTitle:string;
    offhand:boolean;
}

export interface BattleAttackUIDData extends BattleAttackRequestBase{
    targetUid:string;
}

export interface BattleAttackSlotData extends BattleAttackRequestBase{
    targetSlot: number;
}

function instanceOfBattleAttackSlotData(object:any): object is BattleAttackSlotData{
    return 'targetSlot' in object;
}

export interface BattleAttackResponse extends ServerResponse{

}


export default class BattleAttackRequest extends ServerRequest{
    constructor(data:BattleAttackSlotData | BattleAttackUIDData){
        super('BattleAttack',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<void>{
        await this._send(sioc) as BattleAttackResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:BattleAttackSlotData | BattleAttackUIDData):Promise<BattleAttackResponse>{
        if(instanceOfBattleAttackSlotData(data)){
            await bag.game.sendBattleAttackSlot(data.uid,data.targetSlot,data.attackTitle,data.offhand);
        }
        else{
            await bag.game.sendBattleAttack(data.uid,data.targetUid,data.attackTitle,data.offhand);
        }
        
        return {
            success: true,
        };
    }
}