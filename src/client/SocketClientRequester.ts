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
import { EquipmentSlot } from '../core/item/CreatureEquipment';
import ItemBase from '../core/item/ItemBase';
import GrantPlayerXPRequest from '../gameserver/socket/requests/GrantPlayerXPRequest';
import CreatePvPInviteRequest from "../gameserver/socket/requests/CreatePvPInviteRequest";
import { PvPInvite, SocketPvPInvite } from '../core/battle/PvPInvite';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    sioc:SocketIOClient.Socket;
}

export default class SocketClientRequester{
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

    grantItem(playerUid:string,item:ItemBase,amount:number):Promise<number>{
        const request = new GrantPlayerItemRequest({
            uid: playerUid,
            itemId: item.id,
            amount: amount,
        });

        return request.send(this.sioc);
    }

    transferItem(data:TransferPlayerItemData):Promise<void>{
        const request = new TransferPlayerItemRequest(data);

        return request.send(this.sioc);
    }

    grantWishes(playerUid:string,amount:number):Promise<number>{
        const request = new GrantPlayerWishesRequest({
            uid: playerUid,
            amount: amount
        });

        return request.send(this.sioc);
    }

    grantXP(playerUid:string,amount:number):Promise<number>{
        const request = new GrantPlayerXPRequest({
            uid: playerUid,
            amount: amount
        });

        return request.send(this.sioc);
    }

    equipItem(uid:string,itemId:number,offhand:boolean):Promise<number>{
        const request = new EquipPlayerItemRequest({
            uid: uid,
            itemId: itemId,
            offhand: offhand
        });

        return request.send(this.sioc);
    }

    unequipItem(uid:string,slot:EquipmentSlot):Promise<number>{
        const request = new UnequipPlayerItemRequest({
            uid: uid,
            slot: slot,
        });

        return request.send(this.sioc);
    }

    createPvPInvite(senderUid:string,receiverUid:string):Promise<void>{
        const request = new CreatePvPInviteRequest({
            sender: senderUid,
            receiver: receiverUid
        });

        return request.send(this.sioc);
    }

    createPvPBattle(invite:SocketPvPInvite,channelId:string):Promise<void>{
        
    }

    getPvPInvite(playerUid:string):Promise<SocketPvPInvite>{

    }
}