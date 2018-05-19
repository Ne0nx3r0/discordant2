import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const getPlayerQuery = `
    SELECT 

        (SELECT array_agg(row_to_json(inventory_row))
        FROM (
        SELECT * FROM player_equipment_item WHERE player_uid = $1
        ) as inventory_row) as equipment,

        (SELECT array_agg(row_to_json(equipment_row))
        FROM (
        SELECT * FROM player_inventory_item WHERE player_uid = $1
        ) as equipment_row) as inventory,

        *
    FROM player WHERE uid = $1;
`;

export default async function(db:DatabaseService,uid:string):Promise<DBPlayer>{
    const result = await db.getPool().query(getPlayerQuery,[uid]);

    //not found
    if(result.rows.length == 0){
        return null;
    }    

    const row:DBPlayer = result.rows[0];

    return row;
}