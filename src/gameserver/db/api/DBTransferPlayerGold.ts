import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    SELECT transfer_player_gold($1,$2,$3)
`;

export const DBTransferPlayerGold = async function(db:DatabaseService,fromUid:string,toUid:string,amount:number):Promise<void>{
    try{
        const result = await db.getPool().query(queryStr,[fromUid,toUid,amount]);
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.toString();
        }
        throw ex;
    }   
}