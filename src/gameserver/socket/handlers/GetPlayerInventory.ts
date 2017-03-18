import { SocketResponse, SocketRequest } from '../SocketHandler';
import { SocketRequestHandlerBag } from '../SocketServer';
import { SocketPlayerInventory } from '../../../core/item/PlayerInventory';
import SocketHandler from '../SocketHandler';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import Inventory from '../../../bot/commands/Inventory';

export interface GetPlayerInventoryRequest extends SocketRequest{
    uid: string;
    response?:GetPlayerResponse;
}

export interface GetPlayerResponse extends SocketResponse{
    inventory:SocketPlayerInventory;
}

export default new SocketHandler('GetPlayerInventory',async function(bag:SocketRequestHandlerBag,data:GetPlayerInventoryRequest):Promise<GetPlayerResponse>{
    const player:PlayerCharacter = await bag.game.getPlayerCharacter(data.uid);

    if(!player){
        throw 'Player not found';
    }

    return {
        success: true,
        inventory: player.inventory.toSocket()
    };
});