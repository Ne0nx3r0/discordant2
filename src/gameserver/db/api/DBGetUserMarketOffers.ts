import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import { SocketActiveMarketOffer } from "./DBGetActiveMarketOffers";

const queryStr = `
    SELECT id,created,updated,amount_left,item_id,price FROM market_offer WHERE seller_uid = $1 AND ended = false ORDER BY id ASC;
`;

export default async function DBGetUserMarketOffers(db:DatabaseService,uid:string):Promise<Array<SocketActiveMarketOffer>>{
    const result = await db.getPool().query(queryStr,[uid]);

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