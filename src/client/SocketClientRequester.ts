import GetPlayerRoleRequest from '../gameserver/socket/requests/GetPlayerRoleRequest';
import GetPlayerRequest from '../gameserver/socket/requests/GetPlayerRequest';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import GetPlayerInventoryRequest from '../gameserver/socket/requests/GetPlayerInventoryRequest';
import { SocketPlayerInventory } from '../core/item/PlayerInventory';
import SetPlayerRoleRequest from '../gameserver/socket/requests/SetPlayerRoleRequest';
import RegisterPlayerRequest from '../gameserver/socket/requests/RegisterPlayerRequest';
import { RegisterPlayerData } from '../gameserver/socket/requests/RegisterPlayerRequest';
import { GrantPlayerItemData } from '../gameserver/socket/requests/GrantPlayerItemRequest';
import GrantPlayerItemRequest from '../gameserver/socket/requests/GrantPlayerItemRequest';
import TransferPlayerItemRequest from '../gameserver/socket/requests/TransferPlayerItemRequest';
import { TransferPlayerItemData } from '../gameserver/socket/requests/TransferPlayerItemRequest';
import GrantPlayerWishesRequest from '../gameserver/socket/requests/GrantPlayerWishesRequest';
import { GrantPlayerWishesData } from '../gameserver/socket/requests/GrantPlayerWishesRequest';
import { UnequipPlayerItemData } from '../gameserver/socket/requests/UnequipPlayerItemRequest';
import EquipPlayerItemRequest from '../gameserver/socket/requests/EquipPlayerItemRequest';
import { EquipPlayerItemData } from '../gameserver/socket/requests/EquipPlayerItemRequest';
import UnequipPlayerItemRequest from '../gameserver/socket/requests/UnequipPlayerItemRequest';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    sioc:SocketIOClient.Socket;
}

export default class SocketClientServerRequester{
    sioc:SocketIOClient.Socket;
    
    constructor(bag:SocketClientBag){        
        this.sioc = bag.sioc;
    }

    getPlayerRole(playerUID:string):Promise<string>{
        const request = new GetPlayerRoleRequest({
            uid: playerUID
        });

        return request.send(this.sioc);
    }

    setPlayerRole(playerUID:string,role:string):Promise<void>{
        const request = new SetPlayerRoleRequest({
            uid: playerUID,
            role: role
        });
    
        return request.send(this.sioc);
    }

    getPlayer(playerUID:string):Promise<SocketPlayerCharacter>{
        const request = new GetPlayerRequest({
            uid: playerUID
        });

        return request.send(this.sioc);
    }

    getPlayerInventory(playerUID:string):Promise<SocketPlayerInventory>{
        const request = new GetPlayerInventoryRequest({
            uid: playerUID
        });

        return request.send(this.sioc);
    }

    registerPlayer(data:RegisterPlayerData):Promise<SocketPlayerCharacter>{
        const request = new RegisterPlayerRequest(data);

        return request.send(this.sioc);
    }

    grantItem(data:GrantPlayerItemData):Promise<number>{
        const request = new GrantPlayerItemRequest(data);

        return request.send(this.sioc);
    }

    transferItem(data:TransferPlayerItemData):Promise<void>{
        const request = new TransferPlayerItemRequest(data);

        return request.send(this.sioc);
    }

    grantWishes(data:GrantPlayerWishesData):Promise<number>{
        const request = new GrantPlayerWishesRequest(data);

        return request.send(this.sioc);
    }

    grantXP(data:GrantPlayerWishesData):Promise<number>{
        const request = new GrantPlayerWishesRequest(data);

        return request.send(this.sioc);
    }

    equipItem(data:EquipPlayerItemData):Promise<number>{
        const request = new EquipPlayerItemRequest(data);

        return request.send(this.sioc);
    }

    unequipItem(data:UnequipPlayerItemData):Promise<number>{
        const request = new UnequipPlayerItemRequest(data);

        return request.send(this.sioc);
    }
}