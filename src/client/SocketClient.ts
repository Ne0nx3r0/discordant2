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

    getPlayerRole(playerUID:string):Promise<PermissionRole>{
        return (async()=>{
            const requestData:GetPlayerRoleRequest = {
                uid: playerUID
            };

            const request:GetPlayerRoleRequest = await this.gameserverRequest(GetPlayerRole,requestData);
            const roleStr = request.response.role;

            return this.permissions.getRole(roleStr);
        })();
    }

    getPlayer(playerUID:string):Promise<SocketPlayerCharacter>{
        return (async()=>{
            const requestData:GetPlayerRequest = {
                uid:playerUID
            };

            const request:GetPlayerRequest = await this.gameserverRequest(GetPlayer,requestData);

            return request.response.player;
        })();
    }

    getPlayerInventory(playerUID:string):Promise<SocketPlayerInventory>{
        return (async()=>{
            const requestData:GetPlayerInventoryRequest = {
                uid:playerUID
            };

            const request:GetPlayerInventoryRequest = await this.gameserverRequest(GetPlayerInventory,requestData);

            return request.response.inventory;
        })();
    }

    registerPlayer(bag:RegisterPlayerRequest):Promise<SocketPlayerCharacter>{
        return (async()=>{
            const requestData:RegisterPlayerRequest = {
                uid: bag.uid,
                username: bag.username,
                discriminator: bag.discriminator,
                classId: bag.classId,
            };

            const request:RegisterPlayerRequest = await this.gameserverRequest(RegisterPlayer,requestData);

            return request.response.player;
        })();
    }

    grantItem(playerUID:string,item:ItemBase,amount:number):Promise<number>{
        return (async()=>{
            const requestData:GrantPlayerItemRequest = {
                uid: playerUID,
                itemId: item.id,
                amount: amount,
            };

            const request:GrantPlayerItemRequest = await this.gameserverRequest(GrantPlayerItem,requestData);

            return request.response.amountLeft;
        })();
    }

    grantWishes(playerUID:string,amount:number):Promise<number>{
        return (async()=>{
            const requestData:GrantPlayerWishesRequest = {
                uid: playerUID,
                amount: amount,
            };

            const request:GrantPlayerWishesRequest = await this.gameserverRequest(GrantPlayerWishes,requestData);

            return request.response.wishesLeft;
        })();
    }

    grantXP(playerUID:string,amount:number):Promise<number>{
        return (async()=>{
            const requestData:GrantPlayerXPRequest = {
                uid: playerUID,
                amount: amount,
            };

            const request:GrantPlayerXPRequest = await this.gameserverRequest(GrantPlayerXP,requestData);

            return request.response.xpLeft;
        })();
    }

// ---------------------------------------------------------
    addListener(event:SocketClientPushType,callback:Function){
        this.sioc.on(event,callback);
    }

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