import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    UPDATE player 
    SET username = $2
    WHERE uid = $1;
`;

const DBSetPlayerUsername = async function(db:DatabaseService,uid:string,username:string):Promise<void>{
    await db.getPool().query(queryStr,[uid,username]);
}

export default DBSetPlayerUsername;