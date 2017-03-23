import Logger from '../gameserver/log/Logger';
import { Client as DiscordClient } from "discord.js";
import PermissionsService from '../core/permissions/PermissionService';
import ServerRequest from '../gameserver/socket/ServerRequest';
import { ServerResponse } from '../gameserver/socket/ServerRequest';
import { PermissionRole } from '../core/permissions/PermissionService';
import GetPlayerRoleRequest from '../gameserver/socket/requests/GetPlayerRoleRequest';
import GetPlayerRequest from '../gameserver/socket/requests/GetPlayerRequest';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import GetPlayerInventoryRequest from '../gameserver/socket/requests/GetPlayerInventoryRequest';
import { SocketPlayerInventory } from '../core/item/PlayerInventory';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    sioc:SocketIOClient.Socket;
    permissions:PermissionsService;
    logger: Logger;
}

export default class SocketClientServerRequester{
    sioc:SocketIOClient.Socket;
    permissions:PermissionsService;
    logger: Logger;
    
    constructor(bag:SocketClientBag){        
        this.permissions = bag.permissions;
        this.logger = bag.logger;
        this.sioc = bag.sioc;
    }

    async getPlayerRole(playerUID:string):Promise<PermissionRole>{
        const request = new GetPlayerRoleRequest(playerUID);

        const roleStr = await request.send(this.sioc);

        return this.permissions.getRole(roleStr);
    }

    async getPlayer(playerUID:string):Promise<SocketPlayerCharacter>{
        const request = new GetPlayerRequest(playerUID);

        return await request.send(this.sioc);
    }

    async getPlayerInventory(playerUID:string):Promise<SocketPlayerInventory>{
        const request = new GetPlayerInventoryRequest(playerUID);

        return await request.send(this.sioc);
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
}