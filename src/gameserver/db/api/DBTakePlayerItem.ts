import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    select take_player_item($1,$2,$3)
`;

export default async function DBTakePlayerItem(db:DatabaseService,uid:string,itemId:number,amount:number):Promise<void>{
    try{
        const result = await db.getPool().query(queryStr,[uid,itemId,amount]);    
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.toString();
        }
        throw ex;
    }   
}