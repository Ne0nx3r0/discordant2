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

        const dboffer = result.rows[0].market_buy_offer;

        const rowData = dboffer.substr(1,dboffer.length-2).split(',');

        return {
            amountPurchased: Number(rowData[0]),
            totalCost: Number(rowData[1]),
            itemId: Number(rowData[2]),
            sellerUid: rowData[3],
            amountLeft: Number(rowData[4]),
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