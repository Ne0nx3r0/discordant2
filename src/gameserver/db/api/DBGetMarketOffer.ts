import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    SELECT id,created,updated,seller_uid,item_id,amount_left FROM market_offer WHERE id = $1;
`;

interface DBMarketOffer{
    id: number;
    itemId: number;
    amountLeft: number;
    seller: string;
    created: Date;
    updated: Date;
}

const DBSetPlayerRole = async function(db:DatabaseService,offerId:number):Promise<DBMarketOffer>{
    const result = await db.getPool().query(queryStr,[offerId]);

    console.log(result);

    return null;
}

export default DBSetPlayerRole;