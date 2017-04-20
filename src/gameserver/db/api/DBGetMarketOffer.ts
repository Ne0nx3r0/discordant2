import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    SELECT id,created,updated,seller_uid,item_id,amount_left,ended,price FROM market_offer WHERE id = $1;
`;

export interface SocketMarketOffer{
    id: number;
    item: number;
    amountLeft: number;
    seller: string;
    sellerTitle: string;
    created: string;
    updated: string;
    ended: boolean;
    price: number;
}

export default async function DBGetMarketOffer(db:DatabaseService,offerId:number):Promise<SocketMarketOffer>{
    const result = await db.getPool().query(queryStr,[offerId]);

    if(result.rows.length == 0){
        return null;
    }

    const row = result.rows[0];

    return {
        id: row.id,
        created: row.created,
        updated: row.updated,
        seller: row.seller_uid,
        sellerTitle: 'Unknown ('+row.seller_uid+')',
        item: row.item_id,
        amountLeft: row.amount_left,
        ended: row.ended,
        price: row.price,
    };
}