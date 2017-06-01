import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    UPDATE 
        player 
    SET 
        wishes = wishes + $2,
        karma = karma + 1,
        last_daily = $3
    WHERE 
        uid = $1
    RETURNING 
        wishes;
`;

export const DBDailyReward = async function(db:DatabaseService,uid:string,wishesEarned:number):Promise<number>{
    const result = await db.getPool().query(queryStr,[uid,wishesEarned,new Date().getTime()]);

    //not found
    if(result.rows.length == 0){
        throw 'Player not found';
    }    

    const wishesLeft:number = result.rows[0].wishes;

    return wishesLeft;
}