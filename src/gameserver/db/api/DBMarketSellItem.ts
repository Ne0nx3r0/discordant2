import DatabaseService from '../DatabaseService';
import { DBPlayer } from '../DBInterfaces';
import { MarketSellData } from '../../socket/requests/MarketSellRequest';

const queryStr = `
    SELECT market_sell_item($1,$2,$3,$4) as offerid;
`;

export default async function DBMarketSellItem(db:DatabaseService,bag:MarketSellData):Promise<number>{
    try{
        const result = await db.getPool().query(queryStr,[bag.uid,bag.item,bag.amount,bag.price]);

        return result.rows[0].offerid;
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.toString();
        }

        throw ex;
    }   
}