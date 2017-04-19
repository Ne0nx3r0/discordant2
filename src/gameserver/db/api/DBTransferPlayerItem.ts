import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    SELECT transfer_player_item($1,$2,$3,$4)
`;

const DBTransferPlayerItem = async function(db:DatabaseService,fromUid:string,toUid:string,itemId:number,amount:number):Promise<void>{
    try{
        const result = await db.getPool().query(queryStr,[fromUid,toUid,itemId,amount]);
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.error;
        }

        throw ex;
    }   
}

export default DBTransferPlayerItem;