import * as SocketIOClient from 'socket.io-client';
import { PermissionRole } from '../core/permissions/PermissionService';
import PermissionsService from '../core/permissions/PermissionService';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import PlayerCharacter from '../core/creature/player/PlayerCharacter';
import { GetPlayerRequest } from '../gameserver/socket/handlers/GetPlayer';
import GetPlayer  from '../gameserver/socket/handlers/GetPlayer';
import SocketHandler from '../gameserver/socket/SocketHandler';
import { SocketRequest, SocketResponse } from '../gameserver/socket/SocketHandler';
import RegisterPlayer from '../gameserver/socket/handlers/RegisterPlayer';
import { RegisterPlayerRequest } from '../gameserver/socket/handlers/RegisterPlayer';
import GetPlayerRole from '../gameserver/socket/handlers/GetPlayerRole';
import { GetPlayerRoleRequest } from '../gameserver/socket/handlers/GetPlayerRole';
import { SocketPlayerInventory } from '../core/item/PlayerInventory';
import { GetPlayerInventoryRequest } from '../gameserver/socket/handlers/GetPlayerInventory';
import GetPlayerInventory from '../gameserver/socket/handlers/GetPlayerInventory';
import ItemBase from '../core/item/ItemBase';
import { GrantPlayerWishesRequest } from '../gameserver/socket/handlers/GrantPlayerWishes';
import GrantPlayerWishes from '../gameserver/socket/handlers/GrantPlayerWishes';
import { GrantPlayerXPRequest } from '../gameserver/socket/handlers/GrantPlayerXP';
import GrantPlayerXP from '../gameserver/socket/handlers/GrantPlayerXP';
import { GrantPlayerItemRequest } from '../gameserver/socket/handlers/GrantPlayerItem';
import GrantPlayerItem from '../gameserver/socket/handlers/GrantPlayerItem';
import { EquipPlayerItemRequest } from '../gameserver/socket/handlers/EquipPlayerItem';
import EquipPlayerItem from '../gameserver/socket/handlers/EquipPlayerItem';
import { EquipmentSlot } from '../core/item/CreatureEquipment';
import UnequipPlayerItem from '../gameserver/socket/handlers/UnequipPlayerItem';
import { UnequipPlayerItemRequest } from '../gameserver/socket/handlers/UnequipPlayerItem';
import { TransferPlayerItemRequest } from '../gameserver/socket/handlers/TransferPlayerItem';
import TransferPlayerItem from '../gameserver/socket/handlers/TransferPlayerItem';
import { SetPlayerRoleRequest } from '../gameserver/socket/handlers/SetPlayerRole';
import SetPlayerRole from '../gameserver/socket/handlers/SetPlayerRole';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    gameserver:string;
    permissions:PermissionsService;
}

export default class SocketClient{
    sioc:SocketIOClient.Socket;
    permissions:PermissionsService;
    
    constructor(bag:SocketClientBag){        
        this.permissions = bag.permissions;
        this.sioc = SocketIOClient(bag.gameserver);
    }

    async getPlayerRole(playerUID:string):Promise<PermissionRole>{
        const requestData:GetPlayerRoleRequest = {
            uid: playerUID
        };

        const request:GetPlayerRoleRequest = await this.gameserverRequest(GetPlayerRole,requestData);
        const roleStr = request.response.role;

        return this.permissions.getRole(roleStr);
    }

    async getPlayer(playerUID:string):Promise<SocketPlayerCharacter>{
        const requestData:GetPlayerRequest = {
            uid:playerUID
        };

        const request:GetPlayerRequest = await this.gameserverRequest(GetPlayer,requestData);

        return request.response.player;
    }

    async getPlayerInventory(playerUID:string):Promise<SocketPlayerInventory>{
        const requestData:GetPlayerInventoryRequest = {
            uid:playerUID
        };

        const request:GetPlayerInventoryRequest = await this.gameserverRequest(GetPlayerInventory,requestData);

        return request.response.inventory;
    }

    async registerPlayer(bag:RegisterPlayerRequest):Promise<SocketPlayerCharacter>{
        const requestData:RegisterPlayerRequest = {
            uid: bag.uid,
            username: bag.username,
            discriminator: bag.discriminator,
            classId: bag.classId,
        };

        const request:RegisterPlayerRequest = await this.gameserverRequest(RegisterPlayer,requestData);

        return request.response.player;
    }

    async giveItem(fromUID:string,toUID:string,item:ItemBase,amount:number):Promise<void>{
        const requestData:TransferPlayerItemRequest = {
            fromUid: fromUID,
            toUid: toUID,
            itemId: item.id,
            amount: amount,
        };

        const request:TransferPlayerItemRequest = await this.gameserverRequest(TransferPlayerItem,requestData);
    }

    async grantItem(playerUID:string,item:ItemBase,amount:number):Promise<number>{
        const requestData:GrantPlayerItemRequest = {
            uid: playerUID,
            itemId: item.id,
            amount: amount,
        };

        const request:GrantPlayerItemRequest = await this.gameserverRequest(GrantPlayerItem,requestData);

        return request.response.amountLeft;
    }

    async grantWishes(playerUID:string,amount:number):Promise<number>{
        const requestData:GrantPlayerWishesRequest = {
            uid: playerUID,
            amount: amount,
        };

        const request:GrantPlayerWishesRequest = await this.gameserverRequest(GrantPlayerWishes,requestData);

        return request.response.wishesLeft;
    }

    async grantXP(playerUID:string,amount:number):Promise<number>{
        const requestData:GrantPlayerXPRequest = {
            uid: playerUID,
            amount: amount,
        };

        const request:GrantPlayerXPRequest = await this.gameserverRequest(GrantPlayerXP,requestData);

        return request.response.xpLeft;
    }

    async equipItem(playerUID:string,itemId:number,offhand:boolean):Promise<number>{
        const requestData:EquipPlayerItemRequest = {
            uid: playerUID,
            itemId: itemId,
            offhand:offhand,
        };

        const request:EquipPlayerItemRequest = await this.gameserverRequest(EquipPlayerItem,requestData);

        return request.response.unequipped;
    }

    async unequipItem(playerUID:string,slot:EquipmentSlot){
        const requestData:UnequipPlayerItemRequest = {
            uid: playerUID,
            slot: slot,
        };

        const request:UnequipPlayerItemRequest = await this.gameserverRequest(UnequipPlayerItem,requestData);

        return request.response.unequipped;
    }

    async setPlayerRole(playerUID:string,role:string):Promise<void>{
        const requestData:SetPlayerRoleRequest = {
            uid: playerUID,
            role: role,
        };

        const request:SetPlayerRoleRequest = await this.gameserverRequest(SetPlayerRole,requestData);
    }

    

// ---------------------------------------------------------

    gameserverRequest<T>(handler:SocketHandler,requestData:T):Promise<T>{
        const sioc = this.sioc;

        return new Promise(function(resolve,reject){
            try{
                sioc.emit(handler.title,requestData,function(response:SocketResponse){
                    (requestData as SocketRequest).response  = response;

                    if(response.success){
                        resolve(requestData);
                    }
                    else{
                        reject(response.error);
                    }
                });
            }
            catch(ex){
                reject(ex);
            }
        });
    }
}