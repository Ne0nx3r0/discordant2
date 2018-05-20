import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `SELECT buy_stable_stall($1,$2)`;

export async function DBBuyStableStall(db:DatabaseService,uid:string,goldNeeded:number):Promise<void>{
    try{
        await db.getPool().query(queryStr,[uid,goldNeeded]);
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.toString();
        }

        throw ex;
    }   
}