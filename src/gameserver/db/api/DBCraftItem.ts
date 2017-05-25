import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import ItemBase from '../../../core/item/ItemBase';
import { BatchQuery } from '../DatabaseService';

export default async function DBCraftItem(db:DatabaseService,uid:string,item:ItemBase,amount:number):Promise<void>{
    const queries:Array<BatchQuery> = [
        {
            query: 'UPDATE player SET wishes = wishes - $1 where uid = $2',
            params: [item.recipe.wishes,uid],
        },
        {
            query: 'SELECT grant_player_item($1,$2,$3)',
            params: [uid,item.id,amount],
        }
    ];

    item.recipe.components.forEach(function(component){
        queries.push({
            query: 'SELECT take_player_item($1,$2,$3)',
            params: [uid,component.itemId,amount],
        });
    });

    try{
        const result = await db.runBatch(queries);     
    }
    catch(ex){
        //Kind of hackish - "custom" exception from transfer_player_item function
        if(ex.code == 'P0002'){
            throw ex.toString();
        }
        throw ex;
    }   
}