import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import { DBMarketOffer } from "./DBGetMarketOffer";

const ITEMS_PER_PAGE = 10;
const queryStr = `
    SELECT 
        id,item_id,created,updated,amount_left,price 
    FROM 
        market_offer
    WHERE 
        ended = false
    ORDER BY id DESC 
    LIMIT $1 OFFSET $2;
`;

export interface SocketActiveMarketOffer{
    id: number;
    created: string;
    updated: string;
    amountLeft: number;
    item: number;
    price: number;
}

export default async function DBGetNewestActiveMarketOffers(db:DatabaseService,page:number):Promise<Array<SocketActiveMarketOffer>>{
    const result = await db.getPool().query(queryStr,[ITEMS_PER_PAGE,(page-1) * 10]);

    if(result.rows.length == 0){
        return null;
    }

    const rows:Array<SocketActiveMarketOffer> = result.rows.map(function(row){
        const offer:SocketActiveMarketOffer = {
            id: row.id,
            created: row.created,
            updated: row.updated,
            amountLeft: row.amount_left,
            item: row.item_id,
            price: row.price,
        };

        return offer;
    });

    return rows;
}