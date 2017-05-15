import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `SELECT buy_item($1,$2,$3,$4)`;

export async function DBBuyItem(db:DatabaseService,uid:string,itemId:number,amount:number,goldNeeded:number):Promise<void>{
    try{
        await db.getPool().query(queryStr,[uid,itemId,amount,goldNeeded]);
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.toString();
        }

        throw ex;
    }   
}