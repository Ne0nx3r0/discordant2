import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import ItemEquippable from '../../../core/item/ItemEquippable';

const queryStr = `
    select unequip_player_item($1,$2)
`;

const DBUnequipPlayerItem = async function(db:DatabaseService,uid:string,slot:EquipmentSlot):Promise<number>{
    const result = await db.getPool().query(queryStr,[uid,slot]);

    const itemUnequippedId:number = result.rows[0].unequip_player_item;

    return itemUnequippedId;
}

export default DBUnequipPlayerItem;