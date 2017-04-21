import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

export interface PurchasedMarketOffer{
    sellerUid: string;
    amountPurchased: number;
    totalCost: number;
    itemId: number;
    amountLeft: number;
}

const queryStr = `
    SELECT market_buy_offer($1,$2,$3);
`;

export default async function DBBuyMarketOffer(db:DatabaseService,playerUid:string,offerId:number,amount:number):Promise<PurchasedMarketOffer>{
    try{
        const result = await db.getPool().query(queryStr,[playerUid,offerId,amount]);

        return {
            amountPurchased: result.rows[0].amount_purchased,
            totalCost: result.rows[0].total_cost,
            itemId: result.rows[0].item_id,
            sellerUid: result.rows[0].seller_uid,
            amountLeft: result.rows[0].amount_left_after,
        };
    }
    catch(ex){
        //Kind of hackish - "custom" exception
        if(ex.code == 'P0002'){
            throw ex.message;
        }

        throw ex;
    }     
}