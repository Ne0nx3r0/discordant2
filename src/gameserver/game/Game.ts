import DatabaseService from '../db/DatabaseService';
import DBGetPlayerCharacter from '../db/api/DBGetPlayerCharacter';
import { SocketPlayer } from '../../core/socket/SocketRequests';
import PlayerCharacter from '../../core/creature/player/PlayerCharacter';
import { DBInventoryItem, DBEquipmentItem } from '../db/api/DBGetPlayerCharacter';
import InventoryItem from '../../core/item/InventoryItem';

export interface GameServerBag{
    db: DatabaseService;
}

export default class Game{
    db: DatabaseService;
    cachedPCs: Map<string,SocketPlayer>;

    constructor(bag:GameServerBag){
        this.db = bag.db;
    }

    async getPlayerCharacter(uid:string):Promise<PlayerCharacter>{
        const player = this.cachedPCs.get(uid);

        if(!player){
            const dbPlayer = await DBGetPlayerCharacter(this.db,uid);

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
        }

        return player;
    }
}