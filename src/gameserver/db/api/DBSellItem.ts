import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

export async function DBSellItem(db:DatabaseService,uid:string,itemId:number,amount:number,totalValue:number):Promise<void>{
    await db.runBatch([
        {query: 'SELECT take_player_item($1,$2,$3)',params:[uid,itemId,amount]},
        {query: 'UPDATE player SET gold = gold + $2 WHERE player_uid = $1',params:[uid,totalValue]},
    ]);
}