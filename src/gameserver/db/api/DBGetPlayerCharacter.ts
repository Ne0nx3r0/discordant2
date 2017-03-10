import DatabaseService from '../DatabaseService';
import { SocketPlayerInventoryItem, SocketPlayer } from '../../../core/socket/SocketRequests';
import InventoryItem from '../../../core/item/InventoryItem';

interface DBInventoryItem{
    player_uid:string;
    item_id:number;
    amount:number;
}

const getPlayerQuery = `
    SELECT 

        (SELECT array_agg(row_to_json(inventory_row))
        FROM (
        SELECT * FROM player_equipment_item WHERE player_uid = $1
        ) as inventory_row) as equipment,

        (SELECT array_agg(row_to_json(inventory_row))
        FROM (
        SELECT * FROM player_inventory_item WHERE player_uid = $1
        ) as inventory_row) as inventory,

        *
    FROM player WHERE uid = $1;
`;

export interface DBPlayer{
    uid: string;
    discriminator: string;
    title: string;
    description: string;
    xp: number;
    wishes: number;
    class: number;
    karma: number;
    attribute_strength: number;
    attribute_agility: number;
    attribute_vitality: number;
    attribute_spirit: number;
    attribute_charisma: number;
    attribute_luck: number;
    inventory:;
    equipment:;
}

export default async function(db:DatabaseService,uid:string):Promise<DBPlayer>{
    const result = await this.db.getPool().query(getPlayerQuery,[uid]);
    
    //not found
    if(result.rows.length == 0){
        return null;
    }    

    const row:DBPlayer = result.rows[0];

    return row;
}