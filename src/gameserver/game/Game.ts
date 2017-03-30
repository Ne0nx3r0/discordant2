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
import DBGrantPlayerXP from '../db/api/DBGrantPlayerXP';
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

export interface GameServerBag{
    db: DatabaseService;
    getRandomClient:IGetRandomClientFunc;
}

export default class Game{
    db: DatabaseService;
    permissions:PermissionsService;
    cachedPCs: Map<string,PlayerCharacter>;
    pvpInvites: Map<string,PvPInvite>;
    items: AllItems;
    battleCardinality: number;
    getClient: IGetRandomClientFunc;

    constructor(bag:GameServerBag){
        this.db = bag.db;
        this.permissions = new PermissionsService();
        this.cachedPCs = new Map();
        this.pvpInvites = new Map();
        this.items = new AllItems();
        this.battleCardinality = 1;
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
                xp: dbPlayer.xp,
                wishes: dbPlayer.wishes,
                role: this.permissions.getRole(dbPlayer.role),
                karma: dbPlayer.karma
            });

            this.cachedPCs.set(player.uid,player);
        }

        return player;
    }

    async registerPlayerCharacter(bag:RegisterPlayerCharacterBag):Promise<PlayerCharacter>{
        let player:PlayerCharacter = this.cachedPCs.get(bag.uid);

        //Try from database if not
        if(player || await DBGetPlayerCharacter(this.db,bag.uid)){
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
            xp: 0,
            wishes: 0,
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

    async grantPlayerXP(uid:string,amount:number):Promise<number>{
        const player = await this.getPlayerCharacter(uid);

        const leftOver = await DBGrantPlayerXP(this.db,uid,amount);

        player.xp += amount;

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

    async createPvPInvite(senderUid:string,receiverUid:string){
        const sender = await this.getPlayerCharacter(senderUid);
        const receiver = await this.getPlayerCharacter(receiverUid);

        if(!sender){
            throw 'You are not registered';
        }

        if(!receiver){
            throw 'That player is not registered';
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
        },PVP_INVITE_TIMEOUT+100);//+100 ensures the invite will be expired
    }

    async getPvPInvite(playerUid:string):Promise<PvPInvite>{
        return this.pvpInvites.get(playerUid);
    }

    async createPvPBattle(player1Uid:string,player2Uid:string,channelId:string):Promise<void>{
        const sender = await this.getPlayerCharacter(player1Uid);
        const receiver = await this.getPlayerCharacter(player2Uid);

        if(!sender){
            throw 'You are not registered';
        }

        if(!receiver){
            throw 'That player is not registered';
        }

        const battle = new PvPBattle({
            id: this.battleCardinality++,
            channelId: channelId,
            pc1: sender,
            pc2: receiver,
            getClient: this.getClient
        });

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