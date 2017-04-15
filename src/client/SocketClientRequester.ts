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
import GetPvPInviteRequest from "../gameserver/socket/requests/GetPvPInviteRequest";
import CreatePvPBattleRequest from "../gameserver/socket/requests/CreatePvPBattleRequest";
import BattleAttackRequest from '../gameserver/socket/requests/BattleAttackRequest';
import BattleBlockRequest from "../gameserver/socket/requests/BattleBlockRequest";
import CreatePartyRequest from "../gameserver/socket/requests/CreatePartyRequest";
import SetPartyExploringRequest from '../gameserver/socket/requests/SetPartyExploringRequest';
import InvitePlayerToPartyRequest from '../gameserver/socket/requests/InvitePlayerToPartyRequest';
import DeclinePartyInvitationRequest from "../gameserver/socket/requests/DeclinePartyInvitationRequest";
import AcceptPartyInvitationRequest from '../gameserver/socket/requests/AcceptPartyInvitationRequest';
import LeavePartyRequest from '../gameserver/socket/requests/LeavePartyRequest';
import DisbandPartyRequest from "../gameserver/socket/requests/DisbandPartyRequest";
import MovePartyRequest from '../gameserver/socket/requests/MovePartyRequest';
import { PartyMoveDirection } from "../core/party/PartyExploringMap";

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

    grantGold(playerUid:string,amount:number):Promise<number>{
        const request = new GrantPlayerGoldRequest({
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

    getPvPInvite(playerUid:string):Promise<SocketPvPInvite>{
        const request = new GetPvPInviteRequest({
            participant: playerUid
        });

        return request.send(this.sioc);
    }

    createPvPBattle(invite:SocketPvPInvite,channelId:string):Promise<void>{
        const request = new CreatePvPBattleRequest({
            player1: invite.sender.uid,
            player2: invite.receiver.uid,
            channelId: channelId
        });

        return request.send(this.sioc);
    }

    sendBattleAttack(playerUid:string,attackTitle:string,offhand:boolean):Promise<void>{
        const request = new BattleAttackRequest({
            uid: playerUid,
            attackTitle: attackTitle,
            offhand: offhand
        });

        return request.send(this.sioc);
    }

    sendBattleBlock(playerUid:string):Promise<void>{
        const request = new BattleBlockRequest({
            uid: playerUid
        });

        return request.send(this.sioc);
    }

    createParty(title:string,leaderUid:string,channelId:string):Promise<void>{
        const request = new CreatePartyRequest({
            title: title,
            leader: leaderUid,
            channel: channelId,
        });

        return request.send(this.sioc);
    }
    
    setPartyExploring(leaderUid:string):Promise<void>{
        return new SetPartyExploringRequest({
            uid:leaderUid
        })
        .send(this.sioc);
    }

    invitePlayerToJoinParty(leaderUid:string,invitedUid:string):Promise<void>{
        return new InvitePlayerToPartyRequest({
            uid: leaderUid,
            invitedUid: invitedUid
        })
        .send(this.sioc);
    }

    declinePartyInvitation(playerUid:string):Promise<void>{
        return new DeclinePartyInvitationRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    acceptPartyInvitation(playerUid:string):Promise<void>{
        return new AcceptPartyInvitationRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    leaveParty(playerUid:string):Promise<void>{
        return new LeavePartyRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    disbandParty(playerUid:string):Promise<void>{
        return new DisbandPartyRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    moveParty(leaderUid:string,direction:PartyMoveDirection):Promise<void>{
        return new MovePartyRequest({
            uid: leaderUid,
            direction: direction
        })
        .send(this.sioc);
    }
}