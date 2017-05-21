import { ServerResponse, ServerRequestData, ServerRequestReceiveBag } from '../ServerRequest';
import ServerRequest from '../ServerRequest';
import { SocketPlayerCharacter } from '../../../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import ItemId from '../../../core/item/ItemId';

export interface SetPartyExploringData extends ServerRequestData{
    uid: string;
    map: string;
}

export interface SetPartyExploringResponse extends ServerResponse{
    consumedItem: ItemId;
}

export default class SetPartyExploringRequest extends ServerRequest{
    constructor(data:SetPartyExploringData){
        super('SetPartyExploring',data);
    }

    async send(sioc:SocketIOClient.Socket):Promise<SetPartyExploringResponse>{
        return await this._send(sioc) as SetPartyExploringResponse;
    }

    async receive(bag:ServerRequestReceiveBag,data:SetPartyExploringData):Promise<SetPartyExploringResponse>{
        const itemIdConsumed = await bag.game.setPartyExploring(data.uid,data.map);

        return {
            success: true,
            consumedItem: itemIdConsumed,
        };
    }
}