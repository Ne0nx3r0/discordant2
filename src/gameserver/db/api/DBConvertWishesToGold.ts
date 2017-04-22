import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    SELECT convert_wishes_to_gold($1,$2) as gold_gained;
`;

export default async function DBConvertWishesToGold(db:DatabaseService,uid:string,amount:number):Promise<number>{
    try{
        const result = await db.getPool().query(queryStr,[uid,amount]);

        const gold_gained:number = result.rows[0].gold_gained;

        return gold_gained;    
    }
    catch(ex){
        //Kind of hackish - "custom" exception
        if(ex.code == 'P0002'){
            throw ex.message;
        }

        throw ex;
    }    
}
