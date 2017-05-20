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
import GrantPlayerGoldRequest from "../gameserver/socket/requests/GrantPlayerGoldRequest";
import { WishType } from '../gameserver/socket/requests/LevelUpRequest';
import LevelUpRequest from '../gameserver/socket/requests/LevelUpRequest';
import UseItemRequest from '../gameserver/socket/requests/UseItemRequest';
import { Message } from 'discord.js';
import MarketSellRequest from "../gameserver/socket/requests/MarketSellRequest";
import { MarketSellData } from '../gameserver/socket/requests/MarketSellRequest';
import { MarketStopResponse, default as MarketStopRequest } from "../gameserver/socket/requests/MarketStopRequest";
import { SocketActiveMarketOffer } from "../gameserver/db/api/DBGetActiveMarketOffers";
import MarketSearchRequest from "../gameserver/socket/requests/MarketSearchRequest";
import MarketNewOffersRequest from "../gameserver/socket/requests/MarketNewOffersRequest";
import PlayerPartyRequest from "../gameserver/socket/requests/PlayerPartyRequest";
import { SocketPlayerParty } from "../core/party/PlayerParty";
import MarketGetOfferRequest from "../gameserver/socket/requests/MarketGetOfferRequest";
import { SocketMarketOffer } from '../gameserver/db/api/DBGetMarketOffer';
import MarketUserOffersRequest from "../gameserver/socket/requests/MarketUserOffersRequest";
import MarketBuyOfferRequest from "../gameserver/socket/requests/MarketBuyOfferRequest";
import { PurchasedMarketOffer } from "../gameserver/db/api/DBBuyMarketOffer";
import ConvertWishesToGoldRequest from "../gameserver/socket/requests/ConvertWishesToGoldRequest";
import { ConvertWishesToGoldResponse } from '../gameserver/socket/requests/ConvertWishesToGoldRequest';
import BattleChargeRequest from "../gameserver/socket/requests/BattleChargeRequest";
import RespecPlayerRequest from "../gameserver/socket/requests/RespecPlayerRequest";
import SellItemRequest from '../gameserver/socket/requests/SellItemRequest';
import InteractWithCurrentTileRequest from '../gameserver/socket/requests/InteractWithCurrentTileRequest';
import BattleSkipRequest from '../gameserver/socket/requests/BattleSkipRequest';
import BattleRunRequest from '../gameserver/socket/requests/BattleRunRequest';
import BuyItemRequest from '../gameserver/socket/requests/BuyItemRequest';
import SetPlayerDescriptionRequest from '../gameserver/socket/requests/SetPlayerDescriptionRequest';
import IsChannelInUseRequest from '../gameserver/socket/requests/IsChannelInUseRequest';
import { LeadPlayerOption } from '../bot/commands/Top';
import GetTopPlayersRequest from "../gameserver/socket/requests/GetTopPlayersRequest";
import PlayerRefreshRequest from '../gameserver/socket/requests/PlayerRefreshRequest';

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

    getPlayer(playerUID:string,expectedUsername?:string):Promise<SocketPlayerCharacter>{
        const request = new GetPlayerRequest({
            uid: playerUID,
            expectedUsername: expectedUsername
        });

        return request.send(this.sioc);
    }

    getPlayerInventory(playerUID:string):Promise<SocketPlayerInventory>{
        const request = new GetPlayerInventoryRequest({
            uid: playerUID
        });

        return request.send(this.sioc);
    }

    async getTopPlayers(leadOption:LeadPlayerOption){
        const request = new GetTopPlayersRequest({
            type: leadOption
        });

        const response = await request.send(this.sioc);

        return response.players;
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

    sendBattleAttack(playerUid:string,targetUid:string,attackTitle:string,offhand:boolean):Promise<void>{
        const request = new BattleAttackRequest({
            uid: playerUid,
            target: targetUid,
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

    moveParty(leaderUid:string,direction:PartyMoveDirection,steps:number):Promise<void>{
        return new MovePartyRequest({
            uid: leaderUid,
            direction: direction,
            steps: steps,
        })
        .send(this.sioc);
    }

    async interactWithCurrentTile(playerUid:string):Promise<void>{
        await new InteractWithCurrentTileRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    async levelUp(playerUid:string,wishType:WishType):Promise<SocketPlayerCharacter>{
        const response = await new LevelUpRequest({
            uid: playerUid,
            wishType: wishType,
        })
        .send(this.sioc);

        return response.player;
    }

    async respecPlayer(playerUid:string):Promise<void>{
        await new RespecPlayerRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    async buyItem(playerUid:string,item:ItemBase,amount:number):Promise<void>{
        await new BuyItemRequest({
            uid:playerUid,
            item:item.id,
            amount:amount
        })
        .send(this.sioc);
    }

    async useItem(playerUid:string,itemId:number):Promise<string>{
        const response = await new UseItemRequest({
            uid: playerUid,
            item: itemId,
        })
        .send(this.sioc);

        return response.message;
    }

    async marketSell(bag:MarketSellData):Promise<number>{
        const response = await new MarketSellRequest(bag)
        .send(this.sioc);

        return response.offer;
    }

    async marketStop(playerUid:string,offerId:number):Promise<MarketStopResponse>{
        const response = await new MarketStopRequest({
            uid: playerUid,
            offer: offerId,
        })
        .send(this.sioc);

        return response;
    }

    async marketGetOffers(itemId:number):Promise<Array<SocketActiveMarketOffer>>{
        const response = await new MarketSearchRequest({
            item: itemId
        })
        .send(this.sioc);

        return response.offers;
    }

    async refreshPlayer(playerUid:string):Promise<void>{
        await new PlayerRefreshRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    async marketGetPlayerOffers(playerUid:string):Promise<Array<SocketActiveMarketOffer>>{
        const response = await new MarketUserOffersRequest({
            uid: playerUid
        })
        .send(this.sioc);

        return response.offers;
    }

    async getNewestActiveMarketOffers(page: number):Promise<Array<SocketActiveMarketOffer>>{
        const response = await new MarketNewOffersRequest({
            page: page            
        })
        .send(this.sioc);
        
        return response.offers;
    }

    async getMarketOffer(offerId: number):Promise<SocketMarketOffer>{
        const response = await new MarketGetOfferRequest({
            offer: offerId
        })
        .send(this.sioc);

        return response.offer;
    }

    async buyMarketOffer(playerUid:string,offerId:number,amount:number):Promise<PurchasedMarketOffer>{
        const response = await new MarketBuyOfferRequest({
            uid: playerUid,
            offer: offerId,
            amount: amount,
        })
        .send(this.sioc);

        return response.purchased;
    }

    async getPlayerParty(playerUid:string):Promise<SocketPlayerParty>{
        const response = await new PlayerPartyRequest({
            uid: playerUid
        })
        .send(this.sioc);

        return response.party;
    }

    async convertWishesToGold(playerUid:string,amount:number):Promise<ConvertWishesToGoldResponse>{
        const response = await new ConvertWishesToGoldRequest({
            uid: playerUid,
            amount: amount,
        })
        .send(this.sioc);

        return response;
    }

    async sendBattleCharge(playerUid:string):Promise<void>{
        await new BattleChargeRequest({
            uid: playerUid
        })
        .send(this.sioc);
    }

    async sendBattleSkip(requesterUid:string,skipUid:string):Promise<void>{
        await new BattleSkipRequest({
            requesterUid: requesterUid,
            skipUid: skipUid,
        })
        .send(this.sioc);
    }

    async sendBattleRun(playerUid:string):Promise<void>{
        await new BattleRunRequest({
            uid: playerUid,
        })
        .send(this.sioc);
    }

    async sellItem(playerUid:string,item:ItemBase,amount:number):Promise<void>{
        await new SellItemRequest({
            uid: playerUid,
            item: item.id,
            amount: amount,
        })
        .send(this.sioc);
    }

    async isChannelInUse(channelId:string):Promise<boolean>{
        const response = await (new IsChannelInUseRequest({
            channelId: channelId
        })
        .send(this.sioc));

        return response.inUse;
    }

    async setPlayerDescription(playerUid:string,description:string):Promise<void>{
        await new SetPlayerDescriptionRequest({
            uid: playerUid,
            description: description,
        })
        .send(this.sioc);
    }
}