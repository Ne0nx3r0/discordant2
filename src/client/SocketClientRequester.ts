import Logger from '../gameserver/log/Logger';
import { Client as DiscordClient } from "discord.js";
import PermissionsService from '../core/permissions/PermissionService';
import ServerRequest from '../gameserver/socket/ServerRequest';
import { ServerResponse } from '../gameserver/socket/ServerRequest';
import { PermissionRole } from '../core/permissions/PermissionService';
import GetPlayerRole from '../gameserver/socket/requests/GetPlayerRole';

export type SocketClientPushType = 'PlayerRoleUpdated';

export interface SocketClientBag{
    sioc:SocketIOClient.Socket;
    permissions:PermissionsService;
    logger: Logger;
}

export default class SocketClientRequester{
    sioc:SocketIOClient.Socket;
    permissions:PermissionsService;
    logger: Logger;
    
    constructor(bag:SocketClientBag){        
        this.permissions = bag.permissions;
        this.logger = bag.logger;
        this.sioc = bag.sioc;
    }

    gameserverRequest<T>(handler:ServerRequest):Promise<T>{
        const sioc = this.sioc;

        return new Promise(function(resolve,reject){
            try{
                sioc.emit(handler.title,handler.data,function(response:ServerResponse){
                    if(response.success){
                        resolve(response);
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

    async getPlayerRole(playerUID:string):Promise<PermissionRole>{
        const request = new GetPlayerRole(playerUID);

        const response = await request.send(this.sioc);

        const roleStr = response.role;

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
}