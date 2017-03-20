import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    UPDATE player 
    SET role = $2
    WHERE uid = $1;
`;

const DBSetPlayerRole = async function(db:DatabaseService,uid:string,role:string):Promise<void>{
    await db.getPool().query(queryStr,[uid,role]);
}

export default DBSetPlayerRole;