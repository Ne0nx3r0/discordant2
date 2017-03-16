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

export interface GameServerBag{
    db: DatabaseService;
    permissions:PermissionsService;
}

export default class Game{
    db: DatabaseService;
    permissions:PermissionsService;
    cachedPCs: Map<string,PlayerCharacter>;

    constructor(bag:GameServerBag){
        this.db = bag.db;
        this.permissions = bag.permissions;
        this.cachedPCs = new Map();
    }

    async getPlayerCharacter(uid:string):Promise<PlayerCharacter>{
        let player = this.cachedPCs.get(uid);

        if(!player){
            const dbPlayer = await DBGetPlayerCharacter(this.db,uid);

            if(!dbPlayer){
                const response:PlayerCharacter = null;

                return response;
            }
/*
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

            const pcEquipment = new CreatureEquipment(equipment);*/

            player = new PlayerCharacter({
                uid: dbPlayer.uid,
                title: dbPlayer.title,
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
                equipment: new CreatureEquipment({}),
                inventory: new PlayerInventory(),
                xp: dbPlayer.xp,
                wishes: dbPlayer.wishes,
                role: this.permissions.getRole(dbPlayer.role),
                karma: dbPlayer.karma
            });
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
}

export interface RegisterPlayerCharacterBag{
    uid:string;
    discriminator:number;
    username:string;
    classId:number;
}