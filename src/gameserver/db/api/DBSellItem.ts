import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

export async function DBSellItem(db:DatabaseService,uid:string,itemId:number,amount:number,totalValue:number):Promise<void>{
    try{
        await db.runBatch([
            {query: 'SELECT take_player_item($1,$2,$3)',params:[uid,itemId,amount]},
            {query: 'UPDATE player SET gold = gold + $2 WHERE uid = $1',params:[uid,totalValue]},
        ]);
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.error;
        }

        throw ex;
    }   
}