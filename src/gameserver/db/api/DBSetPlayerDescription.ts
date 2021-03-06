import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    UPDATE player 
    SET description = $2
    WHERE uid = $1;
`;

export async function DBSetPlayerDescription(db:DatabaseService,uid:string,description:string):Promise<void>{
    await db.getPool().query(queryStr,[uid,description]);
}