import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import { WishType } from '../../socket/requests/LevelUpRequest';
import GetEarnedWishes from '../../../util/GetEarnedWishes';

const queryStr = `
    SELECT levelup_player($1,$2,$3) as newStatValue;
`;

export default async function DBLevelUp(db:DatabaseService,uid:string,wishType:WishType,wishesNeeded:number):Promise<void>{
    const queries = [];
    const result = await db.getPool().query(queryStr,[uid,wishType,wishesNeeded]);

    //not found
    if(result.rows.length == 0){
        throw 'Player not found';
    }    
}