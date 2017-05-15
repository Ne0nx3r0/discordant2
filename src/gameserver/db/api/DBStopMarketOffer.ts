import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    SELECT market_stop_offer($1);
`;

export default async function DBStopMarketOffer(db:DatabaseService,offerId:number):Promise<void>{
    try{
        await db.getPool().query(queryStr,[offerId]);
    }
    catch(ex){
        //Kind of hackish - "custom" exception
        if(ex.code == 'P0002'){
            throw ex.toString();
        }

        throw ex;
    }     
}