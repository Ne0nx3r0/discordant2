import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import { DBMarketOffer } from "./DBGetMarketOffer";

const queryStr = `
    SELECT id,created,updated,amount_left,price FROM market_offer WHERE item_id = $1 AND ended = false ORDER BY price ASC LIMIT 10;
`;

export interface SocketActiveMarketOffer{
    id: number;
    created: string;
    updated: string;
    amountLeft: number;
    item: number;
    price: number;
}

export default async function DBGetActiveMarketOffers(db:DatabaseService,itemId:number):Promise<Array<SocketActiveMarketOffer>>{
    const result = await db.getPool().query(queryStr,[itemId]);

    if(result.rows.length == 0){
        return null;
    }

    const rows:Array<SocketActiveMarketOffer> = result.rows.map(function(row){
        const offer:SocketActiveMarketOffer = {
            id: row.id,
            created: row.created,
            updated: row.updated,
            amountLeft: row.amount_left,
            item: itemId,
            price: row.price,
        };

        return offer;
    });

    return rows;
}