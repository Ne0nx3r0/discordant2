import DatabaseService from '../DatabaseService';
import { DBPlayer } from '../DBInterfaces';
import { MarketSellData } from '../../socket/requests/MarketSellRequest';
import shortid from 'shortid';

/*
check if player has more than max items for sale (10?)
check if player has this item for sale already
remove the item from the player's inventory (take_player_item())
insert for sale record
return new id of for sale record
*/

const queryStr = `
    UPDATE player 
    SET role = $2
    WHERE uid = $1;
`;

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyz');

export default async function DBMarketSellItem(db:DatabaseService,bag:MarketSellData):Promise<string>{


    await db.getPool().query(queryStr,[uid,role]);
}