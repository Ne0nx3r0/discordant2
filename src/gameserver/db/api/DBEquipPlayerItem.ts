import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import ItemEquippable from '../../../core/item/ItemEquippable';

const queryStr = `
    select equip_player_item($1,$2,$3)
`;

const DBEquipPlayerItem = async function(db:DatabaseService,uid:string,itemId:number,slot:EquipmentSlot):Promise<number>{
    const result = await db.getPool().query(queryStr,[uid,itemId,slot]);

    const itemUnequippedId:number = result.rows[0].equip_player_item;

    return itemUnequippedId;
}

export default DBEquipPlayerItem;