import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    UPDATE player 
    SET xp = xp + $2
    WHERE uid = $1
    RETURNING xp;
`;

const DBGrantPlayerXP = async function(db:DatabaseService,uid:string,amount:number):Promise<number>{
    const result = await db.getPool().query(queryStr,[uid,amount]);

    //not found
    if(result.rows.length == 0){
        throw 'Player not found';
    }    

    const xp:number = result.rows[0].wishes;

    return xp;
}

export default DBGrantPlayerXP;