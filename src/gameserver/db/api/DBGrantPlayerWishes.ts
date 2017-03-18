import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    UPDATE player 
    SET wishes = wishes + $1
    WHERE uid = $2
    RETURNING wishes;
`;

const DBGrantPlayerWishes = async function(db:DatabaseService,uid:string,amount:number):Promise<number>{
    const result = await db.getPool().query(queryStr,[uid,amount]);

    //not found
    if(result.rows.length == 0){
        throw 'Player not found';
    }    

    const wishes:number = result.rows[0].wishes;

    return wishes;
}

export default DBGrantPlayerWishes;