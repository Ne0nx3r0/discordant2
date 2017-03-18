import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';

const queryStr = `
    select grant_player_item($1,$2,$3)
`;

const DBGrantPlayerItem = async function(db:DatabaseService,uid:string,itemId:number,amount:number):Promise<void>{
    const result = await db.getPool().query(queryStr,[uid+'1',itemId,amount]);

    console.log(result);
    
}

export default DBGrantPlayerItem;