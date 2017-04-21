import DatabaseService from '../db/DatabaseService';
import DBGetPlayerCharacter from '../db/api/DBGetPlayerCharacter';
import PlayerCharacter from '../../core/creature/player/PlayerCharacter';
import InventoryItem from '../../core/item/InventoryItem';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import CreatureEquipment from '../../core/item/CreatureEquipment';
import PlayerInventory from '../../core/item/PlayerInventory';
import PermissionsService from '../../core/permissions/PermissionService';
import AttributeSet from '../../core/creature/AttributeSet';
import CharacterClass from '../../core/creature/player/CharacterClass';
import DBRegisterPlayerCharacter from '../db/api/DBRegisterPlayerCharacter';
import DBGrantPlayerWishes from '../db/api/DBGrantPlayerWishes';
import { EquipmentSlot, EquipmentBag } from '../../core/item/CreatureEquipment';
import AllItems from '../../core/item/AllItems';
import DBGrantPlayerGold from '../db/api/DBGrantPlayerGold';
import ItemBase from '../../core/item/ItemBase';
import DBGrantPlayerItem from '../db/api/DBGrantPlayerItem';
import DBEquipPlayerItem from '../db/api/DBEquipPlayerItem';
import DBUnequipPlayerItem from '../db/api/DBUnequipPlayerItem';
import ItemEquippable from '../../core/item/ItemEquippable';
import Weapon from '../../core/item/Weapon';
import DBTransferPlayerItem from '../db/api/DBTransferPlayerItem';
import DBSetPlayerRole from '../db/api/DBSetPlayerRole';
import { PvPInvite, PVP_INVITE_TIMEOUT, SocketPvPInvite } from '../../core/battle/PvPInvite';
import PvPBattle from './battle/PvPBattle';
import { IGetRandomClientFunc } from '../socket/SocketServer';
import PlayerParty from "../../core/party/PlayerParty";
import AllCreaturesAIControlled from "../../core/creature/AllCreaturesAIControlled";
import CoopBattle from '../../core/battle/CoopBattle';
import PlayerBattle from '../../core/battle/PlayerBattle';
import MapUrlCache from '../../core/map/MapUrlCache';
import { WesternGateMap } from "../../core/map/Maps";
import { PartyMoveDirection } from "../../core/party/PartyExploringMap";
import { WishType } from '../socket/requests/LevelUpRequest';
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';
import { XPToLevel } from "../../util/XPToLevel";
import DBLevelUp from "../db/api/DBLevelUp";
import ItemUsable from '../../core/item/ItemUsable';
import DBTakePlayerItem from "../db/api/DBTakePlayerItem";
import { MarketSellData } from '../socket/requests/MarketSellRequest';
import DBMarketSellItem from "../db/api/DBMarketSellItem";
import { MarketStopResponse } from '../socket/requests/MarketStopRequest';
import DBGetMarketOffer, { SocketMarketOffer } from "../db/api/DBGetMarketOffer";
import DBStopMarketOffer from "../db/api/DBStopMarketOffer";
import DBGetActiveMarketOffers from "../db/api/DBGetActiveMarketOffers";
import { SocketActiveMarketOffer } from '../db/api/DBGetActiveMarketOffers';
import DBGetNewestActiveMarketOffers from "../db/api/DBGetNewestActiveMarketOffers";
import DBGetUserMarketOffers from "../db/api/DBGetUserMarketOffers";
import DBBuyMarketOffer from "../db/api/DBBuyMarketOffer";
import { PurchasedMarketOffer } from '../db/api/DBBuyMarketOffer';

export interface GameServerBag{
    db: DatabaseService;
    getRandomClient:IGetRandomClientFunc;
}

export default class Game {
    creatures: AllCreaturesAIControlled;
    db: DatabaseService;
    permissions:PermissionsService;
    cachedPCs: Map<string,PlayerCharacter>;
    pvpInvites: Map<string,PvPInvite>;
    items: AllItems;
    getClient: IGetRandomClientFunc;
    playerParties:Map<string,PlayerParty>;
    activeBattles:Map<string,PlayerBattle>;
    mapUrlCache: MapUrlCache;

    constructor(bag:GameServerBag){
        this.db = bag.db;

        //assume stricter production perms, but we don't check perms serverside
        this.permissions = new PermissionsService(true);
        
        this.cachedPCs = new Map();
        this.pvpInvites = new Map();
        this.playerParties = new Map();
        this.activeBattles = new Map();
        this.items = new AllItems();
        this.mapUrlCache = new MapUrlCache();
        this.creatures = new AllCreaturesAIControlled();
        this.getClient = bag.getRandomClient;
    }

    async getPlayerCharacter(uid:string):Promise<PlayerCharacter>{
        let player = this.cachedPCs.get(uid);

        if(!player){
            const dbPlayer = await DBGetPlayerCharacter(this.db,uid);

            if(!dbPlayer){
                const response:PlayerCharacter = null;

                return response;
            }

            const inventory = new Map<number,InventoryItem>();

            if(dbPlayer.inventory){
                dbPlayer.inventory.forEach((item:DBInventoryItem)=>{
                    inventory.set(item.item_id,new InventoryItem(this.items.get(item.item_id),item.amount));
                });
            }

            const pcInventory = new PlayerInventory(inventory);
            
            const equipment = {};

            if(dbPlayer.equipment){
                dbPlayer.equipment.forEach((item:DBEquipmentItem)=>{
                    equipment[item.slot] = this.items.get(item.item_id);
                });
            }

            const pcEquipment = new CreatureEquipment(equipment);

            player = new PlayerCharacter({
                uid: dbPlayer.uid,
                title: dbPlayer.username,
                level: dbPlayer.level,
                description: dbPlayer.description,
                attributes: new AttributeSet({
                    strength: dbPlayer.attribute_strength,
                    agility: dbPlayer.attribute_agility,
                    vitality: dbPlayer.attribute_vitality,
                    spirit: dbPlayer.attribute_spirit,
                    charisma: dbPlayer.attribute_charisma,
                    luck: dbPlayer.attribute_luck,
                }),
                class: CharacterClasses.get(dbPlayer.class),
                equipment: pcEquipment,
                inventory: pcInventory,
                gold: dbPlayer.gold,
                wishes: dbPlayer.wishes,
                role: this.permissions.getRole(dbPlayer.role),
                karma: dbPlayer.karma
            });

            this.cachedPCs.set(player.uid,player);
        }

        return player;
    }

    async registerPlayerCharacter(bag:RegisterPlayerCharacterBag):Promise<PlayerCharacter>{
        let player:PlayerCharacter = await this.getPlayerCharacter(bag.uid);

        if(player){
            throw 'Already registered';
        }

        const playerClass:CharacterClass = CharacterClasses.get(bag.classId);

        if(!playerClass){
            throw 'Invalid class ID "'+bag.classId+'"';
        }

        await DBRegisterPlayerCharacter(this.db,{
            uid: bag.uid,
            username: bag.username,
            class: playerClass,
            discriminator: bag.discriminator,
        });

        player = new PlayerCharacter({
            uid: bag.uid,
            title: bag.username,
            description: playerClass.description,
            attributes: playerClass.startingAttributes,
            class: playerClass,
            equipment: playerClass.startingEquipment,
            inventory: new PlayerInventory(),
            gold: 0,
            wishes: 0,
            level: 0,
            role: this.permissions.getRole('player'),
            karma: 0,
        });

        return player;
    }

    async grantPlayerWishes(uid:string,amount:number):Promise<number>{
        const player = await this.getPlayerCharacter(uid);

        const leftOver = await DBGrantPlayerWishes(this.db,uid,amount);

        player.wishes += amount;

        return leftOver;
    }

    async grantPlayerGold(uid:string,amount:number):Promise<number>{
        const player = await this.getPlayerCharacter(uid);

        const leftOver = await DBGrantPlayerGold(this.db,uid,amount);

        player.gold += amount;

        return leftOver;
    }

    async grantPlayerItem(uid:string,itemId:number,amount:number):Promise<number>{
        if(amount < 1){
            throw 'Cannot give a negative item';
        }

        const player = await this.getPlayerCharacter(uid);

        if(!player){
            throw 'Player is not registered';
        }
        
        const itemBase = this.items.get(itemId);

        if(!itemBase){
            throw 'Invalid item id '+itemId;
        }

        await DBGrantPlayerItem(this.db,uid,itemId,amount);

        player.inventory._addItem(itemBase,amount);

        return player.inventory.getItemAmount(itemBase);
    }

    async takePlayerItem(uid:string,itemId:number,amount:number):Promise<number>{
        if(amount < 1){
            throw 'Cannot take a negative item';
        }

        const player = await this.getPlayerCharacter(uid);

        if(!player){
            throw 'Player is not registered';
        }
        
        const itemBase = this.items.get(itemId);

        if(!itemBase){
            throw 'Invalid item id '+itemId;
        }

        await DBTakePlayerItem(this.db,uid,itemId,amount);

        player.inventory._removeItem(itemBase,amount);

        return player.inventory.getItemAmount(itemBase);
    }

    async transferPlayerItem(fromUID:string,toUID:string,itemId:number,amount:number):Promise<void>{
        if(amount < 1){
            throw 'Cannot transfer a negative item';
        }
        
        const fromPlayer = await this.getPlayerCharacter(fromUID);

        if(!fromPlayer){
            throw 'You are not registered';
        }

        const toPlayer = await this.getPlayerCharacter(toUID);

        if(!toPlayer){
            throw 'That player is not registered';
        }
        
        const itemBase = this.items.get(itemId);

        if(!itemBase){
            throw 'Invalid item id '+itemId;
        }

        await DBTransferPlayerItem(this.db,fromPlayer.uid,toPlayer.uid,itemBase.id,amount);
    }

    async equipPlayerItem(uid:string,itemId:number,offhand:boolean):Promise<number>{
        const player = await this.getPlayerCharacter(uid);

        if(!player){
            throw 'Player is not registered';
        }

        if(player.battle){
            throw 'You cannot change weapons in combat!';
        }
        
        const itemBase = this.items.get(itemId);

        if(!itemBase){
            throw 'Invalid item id '+itemId;
        }

        if(!player.inventory.hasItem(itemBase)){
            throw `You have no ${itemBase.title}`;
        }
        
        if(!(itemBase instanceof ItemEquippable)){
            throw `${itemBase.title} is not equippable`;
        }

        const itemEquippable:ItemEquippable = itemBase as ItemEquippable;

        if(offhand && !(itemBase instanceof Weapon)){
            throw `${itemBase.title} cannot be equipped as an offhand weapon`;
        }

        const slot:EquipmentSlot = offhand ? 'offhand' : itemEquippable.slotType;

        const itemUnequippedId = await DBEquipPlayerItem(this.db,uid,itemBase.id,slot);

        player.inventory._removeItem(itemBase,1);
        
        player.equipment._items[slot] = itemBase;

        if(itemUnequippedId){
            const itemUnequipped = this.items.get(itemUnequippedId);

            if(itemUnequipped){
                player.inventory._addItem(itemUnequipped,1);
            }
        }

        return itemUnequippedId;
    }

    async unequipPlayerItem(uid:string,slot:EquipmentSlot):Promise<number>{
        const player = await this.getPlayerCharacter(uid);

        if(!player){
            throw 'You are not registered yet';
        }

        if(player.battle){
            throw 'You cannot change weapons in combat!';
        }

        const itemToUnequip = player.equipment._items[slot];

        if(!itemToUnequip){
            throw `No ${slot} item equipped`;
        }

        //this one is from the database so we trust it
        const itemUnequippedId = await DBUnequipPlayerItem(this.db,player.uid,slot);

        const itemUnequipped:ItemEquippable = this.items.get(itemUnequippedId) as ItemEquippable;
        
        delete player.equipment._items[slot];

        player.inventory._addItem(itemUnequipped,1);

        return itemUnequipped.id;
    }

    async setPlayerRole(uid:string,role:string):Promise<void>{
        const player = await this.getPlayerCharacter(uid);

        if(!this.permissions.isRole(role)){
            throw `${role} is not a valid role`;
        }

        await DBSetPlayerRole(this.db,player.uid,role);
    }

    async createParty(title:string, leaderUid:string,channelId:string):Promise<void>{
        const leader = await this.getPlayerCharacter(leaderUid);

        if(leader.status != 'inCity'){
            throw 'You cannot create a party right now';
        }

        const party = new PlayerParty({
            leader:leader,
            game: this,
            title: title,
            channelId: channelId,
            getClient: this.getClient.bind(this)
        });

        this.playerParties.set(leader.uid,party);
    }

    async createPvPInvite(senderUid:string,receiverUid:string){
        const sender = await this.getPlayerCharacter(senderUid);
        const receiver = await this.getPlayerCharacter(receiverUid);

        if(!sender){
            throw 'You are not registered';
        }

        if(!receiver){
            throw 'That player is not registered';
        }

        if(this.pvpInvites.has(sender.uid)){
            throw 'You cannot send challenges now';
        }

        if(this.pvpInvites.has(receiver.uid)){
            throw `${receiver.title} cannot receive challenges right now`;
        }

        const invite = {
            sender: sender,
            receiver: receiver,
            expires: Date.now()+PVP_INVITE_TIMEOUT
        };

        this.pvpInvites.set(sender.uid,invite);
        this.pvpInvites.set(receiver.uid,invite);

        setTimeout(()=>{
            const maybeSameInviteSent = this.pvpInvites.get(sender.uid);

            if(maybeSameInviteSent == invite){
                this.pvpInvites.delete(sender.uid);
            }

            const maybeSameInviteReceived = this.pvpInvites.get(receiver.uid);

            if(maybeSameInviteReceived == invite){
                this.pvpInvites.delete(receiver.uid);
            }
        },PVP_INVITE_TIMEOUT+500);//+500 ensures the invite will be expired
    }

    async getPvPInvite(playerUid:string):Promise<PvPInvite>{
        const invite = this.pvpInvites.get(playerUid);

        if(!invite){
            throw 'No pending PvP invitation found (maybe it expired?)';
        }

        return invite;
    }

    async createPvPBattle(player1Uid:string,player2Uid:string,channelId:string):Promise<void>{
        const sender = await this.getPlayerCharacter(player1Uid);
        const receiver = await this.getPlayerCharacter(player2Uid);

        if(this.activeBattles.has(channelId)){
            throw 'A battle is already going on in that channel!';
        }

        if(!sender){
            throw 'You are not registered';
        }

        if(!receiver){
            throw 'That player is not registered';
        }

        if(sender.status != 'invitedToPVPBattle'){
            throw 'You have no pending challenge';
        }

        if(receiver.status != 'invitedToPVPBattle'){
            throw `${receiver.title} cannot join the battle now`;
        }

        const battle = new PvPBattle({
            channelId: channelId,
            pc1: sender,
            pc2: receiver,
            getClient: this.getClient.bind(this),
            removeBattle: this.removeBattle.bind(this)
        });

        this.activeBattles.set(channelId,battle);

        this.pvpInvites.delete(sender.uid);
        this.pvpInvites.delete(receiver.uid);
    }

    async sendBattleAttack(uid:string,attackTitle:string,offhand:boolean):Promise<void>{
        const attacker = await this.getPlayerCharacter(uid);

        if(!attacker){
            throw 'You are not registered yet';
        }

        if(attacker.status != 'inBattle'){
            throw 'You are not currently in a battle';
        }

        const weapon = offhand ? attacker.equipment.offhand : attacker.equipment.weapon;

        if(!weapon){
            throw 'Weapon not found whaaa';
        }

        const weaponAttack = weapon.findAttack(attackTitle);

        if(!weaponAttack){
            throw attackTitle+' is not a valid attack for '+weapon.title;
        }

        attacker.battle.playerActionAttack(attacker,weaponAttack);
    }

    async sendBattleBlock(uid:string){
        const blocker = await this.getPlayerCharacter(uid);

        if(!blocker){
            throw 'You are not registered yet';
        }

        if(blocker.status != 'inBattle'){
            throw 'You are not currently in a battle';
        }

        blocker.battle.playerActionBlock(blocker);
    }

    createMonsterBattle(bag:CreateMonsterBattleBag){
        const opponent = this.creatures.create(bag.opponentId);

        const battle = new CoopBattle({
            id: bag.party.channelId,
            party: bag.party,
            partyMembers: bag.partyMembers,
            getClient: this.getClient.bind(this),
            opponent: opponent,
            removeBattle: this.removeBattle.bind(this),
        });

        return battle;
    }

    removeBattle(battleId:string):void{
        this.activeBattles.delete(battleId);
    }

    setSliceRemoteUrl(imageSrc:string,remoteUrl:string):void{
        this.mapUrlCache.setSliceRemoteUrl(imageSrc,remoteUrl);
    }

    getSliceRemoteUrl(imageSrc:string):string{
        return this.mapUrlCache.getSliceRemoteUrl(imageSrc);
    }

    async setPartyExploring(leaderUid:string):Promise<void>{
        const player = await this.getPlayerCharacter(leaderUid);

        if(!player){
            throw 'You are not registered';
        }

        if(player.status != 'inParty'){
            throw 'Only the party leader can direct the party';
        }

        const party = this.playerParties.get(player.uid);

        if(!party){
            throw 'Only the party leader can direct the party!';
        }

        party.explore(WesternGateMap);
    }

    async invitePlayerToParty(leaderUid:string,inviteUid:string):Promise<void>{
        const player = await this.getPlayerCharacter(leaderUid);

        if(!player){
            throw 'You are not registered';
        }

        if(player.status != 'inParty'){
            throw 'Only the party leader can invite people to the party';
        }

        const party = this.playerParties.get(player.uid);

        if(!party){
            throw 'Only the party leader can direct the party!';
        }

        const invited = await this.getPlayerCharacter(inviteUid);

        if(!invited){
            throw 'That player is not registered yet';
        }

        if(invited.status != 'inCity'){
            throw 'That player cannot be invited to join a party right now';
        }

        party.playerActionInvite(invited);
    }

    async declinePartyInvitation(playerUid:string):Promise<void>{
        const invited = await this.getPlayerCharacter(playerUid);

        if(!invited){
            throw 'That player is not registered yet';
        }

        if(invited.status != 'invitedToParty' || invited.party == null){
            throw 'No pending invitation';
        }

        invited.party.playerActionDecline(invited);
    }

    async acceptPartyInvitation(playerUid:string):Promise<void>{
        const invited = await this.getPlayerCharacter(playerUid);

        if(!invited){
            throw 'That player is not registered yet';
        }

        if(invited.status != 'invitedToParty' || invited.party == null){
            throw 'No pending invitation';
        }

        invited.party.playerActionJoin(invited);
    }

    async leaveParty(playerUid:string):Promise<void>{
        const player = await this.getPlayerCharacter(playerUid);

        if(!player){
            throw 'That player is not registered yet';
        }

        if(player.party == null){
            throw 'You are not currently in a party';
        }

        player.party.playerActionLeave(player);
    }

    async disbandParty(leaderUid:string):Promise<void>{
        const player = await this.getPlayerCharacter(leaderUid);

        if(!player){
            throw 'You are not registered';
        }

        if(player.status != 'inParty'){
            throw 'You are not currently in a party';
        }

        const party = this.playerParties.get(player.uid);

        if(!party){
            throw 'Only the party leader can disband the party';
        }

        party.playerActionDisband();
    }

    async moveParty(leaderUid:string,direction:PartyMoveDirection):Promise<void>{
        const player = await this.getPlayerCharacter(leaderUid);

        if(!player){
            throw 'You are not registered';
        }

        if(player.status != 'inParty'){
            throw 'Only the party leader can move the party';
        }

        const party = this.playerParties.get(player.uid);

        if(!party){
            throw 'Only the party leader can move the party';
        }
        
        party.move(direction);
    }

    async levelUp(playerUid:string,wishType:WishType):Promise<PlayerCharacter>{
        const pc = await this.getPlayerCharacter(playerUid);
        const pcXPToLevel = XPToLevel[pc.level];

        if(pc.wishes < pcXPToLevel){
            throw 'Not enough wishes';
        }

        await DBLevelUp(this.db,playerUid,wishType,pcXPToLevel);

        const tempPC = await DBGetPlayerCharacter(this.db,pc.uid);
        
        pc.wishes = tempPC.wishes;
        pc.level = tempPC.level;
        pc.attributes = {
            Strength: tempPC.attribute_strength,
            Agility: tempPC.attribute_agility,
            Vitality:  tempPC.attribute_vitality,
            Spirit: tempPC.attribute_spirit,
            Luck: tempPC.attribute_luck,
            Charisma: tempPC.attribute_charisma
        };
        pc.updateStats();

        return pc;
    }

    async useItem(playerUid:string,itemId:number):Promise<string>{
        const pc = await this.getPlayerCharacter(playerUid);

        if(!pc){
            throw 'You are not registered';
        }

        const item = this.items.get(itemId);

        if(!item){
            throw `Item not found (${itemId})`;
        }

        if(!(item instanceof ItemUsable)){
            throw `${item.title} is not usable`;
        }

        if(!pc.inventory.hasItem(item,1)){
            throw `You don't have any ${item.title}`;
        }

        //Will throw error if something goes wrong
        item.canUse(pc);

        if(pc.battle){
            //Throws error if something is wrong, exhausts player so they can't take another action
            pc.battle.useItem(pc,item);
        }

        await this.takePlayerItem(pc.uid,item.id,1);//May throw error

        return item.onUse(pc);//allowed to throw error
    }

    async marketSellItem(bag:MarketSellData):Promise<number>{
        const pc = await this.getPlayerCharacter(bag.uid);

        if(!pc){
            throw 'You are not registered';
        }    

        const item = this.items.get(bag.item);

        if(!item){
            throw `Unknown item id ${bag.item}`;
        }
        
        if(isNaN(bag.price) || bag.amount < 1){
            throw 'Invalid amount';
        }

        if(isNaN(bag.amount) || bag.price < 1){
            throw 'Invalid price';
        }

        const offerId = await DBMarketSellItem(this.db,bag);

        pc.inventory._removeItem(item,bag.amount);

        return offerId;
    }

    async getMarketOffer(offerId:number):Promise<SocketMarketOffer>{
        const offer = await DBGetMarketOffer(this.db,offerId);

        if(!offer){
            throw 'Invalid market offer';
        }

        //override the seller with their username if we have it
        const seller = await this.getPlayerCharacter(offer.seller);

        if(seller){
            offer.sellerTitle = seller.title+' ('+seller.uid+')';
        }

        return offer;
    }

    async buyMarketOffer(playerUid:string,offerId:number,amount:number):Promise<PurchasedMarketOffer>{
        const buyer = await this.getPlayerCharacter(playerUid);

        if(!buyer){
            throw 'You are not registered';
        }

        if(amount < 1){
            throw 'Invalid amount to buy';
        }

        const purchased:PurchasedMarketOffer = await DBBuyMarketOffer(this.db,playerUid,offerId,amount);

        const item = this.items.get(purchased.itemId);

        buyer.inventory._addItem(item,purchased.amountPurchased);
        buyer.gold -= purchased.totalCost;

        const seller = this.cachedPCs.get(purchased.sellerUid);

        if(seller){
            seller.gold += purchased.totalCost;
        }

        return purchased;
    }

    async marketStopItem(playerUid:string,offerId:number):Promise<InventoryItem>{
        const pc = await this.getPlayerCharacter(playerUid);

        if(!pc){
            throw 'You are not registered';
        }

        const offer = await DBGetMarketOffer(this.db,offerId);

        if(!offer){
            throw 'Offer not found';
        }

        if(offer.ended){
            throw 'Offer ended already';
        }

        const itemId = this.items.get(offer.item);
        const amountLeft = offer.amountLeft;

        await DBStopMarketOffer(this.db,offerId);

        const invItem = new InventoryItem(itemId,amountLeft);

        pc.inventory._addItem(invItem.base,invItem.amount);

        return invItem;
    }

    async getActiveMarketOffers(itemId: number):Promise<Array<SocketActiveMarketOffer>>{
        const offers = DBGetActiveMarketOffers(this.db,itemId);

        return offers;
    }

    async getUserOffers(playerUid:string):Promise<Array<SocketActiveMarketOffer>>{
        const pc = await this.getPlayerCharacter(playerUid);

        if(!pc){
            throw 'Player not found';
        }

        const offers = DBGetUserMarketOffers(this.db,pc.uid);

        return offers;
    }

    async getNewestActiveMarketOffers(page:number):Promise<Array<SocketActiveMarketOffer>>{
        const offers = await DBGetNewestActiveMarketOffers(this.db,page);

        return offers;
    }

    async getPlayerParty(playerUid: string):Promise<PlayerParty>{
        const pc = await this.getPlayerCharacter(playerUid);

        if(!pc){
            throw 'You are not registered';
        }

        if(!pc.party){
            throw 'You are not in a party';
        }

        const party = pc.party;

        return party;
    }
}

export interface IRemoveBattleFunc{
    (battleId:string):void;
}

interface CreateMonsterBattleBag{
    party: PlayerParty;
    partyMembers: Array<PlayerCharacter>;
    opponentId: number;
}

export interface RegisterPlayerCharacterBag{
    uid:string;
    discriminator:string;
    username:string;
    classId:number;
}

interface DBEquipmentItem{
    player_uid:string;
    item_id:number;
    slot:EquipmentSlot;
}

interface DBInventoryItem{
    player_uid:string;
    item_id:number;
    amount:number;
}