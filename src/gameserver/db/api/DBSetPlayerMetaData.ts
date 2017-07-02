import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    UPDATE player 
    SET metadata = $2
    WHERE uid = $1;
`;

export const DBSetPlayerMetaData = async function(db:DatabaseService,uid:string,metadata:any):Promise<void>{
    await db.getPool().query(queryStr,[uid,JSON.stringify(metadata)]);
}