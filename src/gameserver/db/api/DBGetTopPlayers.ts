import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import { LeadPlayerOption } from '../../../bot/commands/Top';
import { ITopPlayer } from '../../socket/requests/GetTopPlayersRequest';

const queryStr = `
    SELECT username,{column}
    FROM player
    ORDER BY {column} DESC
    LIMIT 10;
`;

export const DBGetTopPlayers = async function(db:DatabaseService,type:LeadPlayerOption):Promise<Array<ITopPlayer>>{
    let attributeStr = '';

    if(type == LeadPlayerOption.strength) attributeStr = 'attribute_strength';
    else if(type == LeadPlayerOption.agility) attributeStr = 'attribute_agility';
    else if(type == LeadPlayerOption.vitality) attributeStr = 'attribute_vitality';
    else if(type == LeadPlayerOption.spirit) attributeStr = 'attribute_spirit';
    else if(type == LeadPlayerOption.luck) attributeStr = 'attribute_luck';
    else if(type == LeadPlayerOption.gold) attributeStr = 'gold';
    else if(type == LeadPlayerOption.level) attributeStr = 'level';
    else /*if(type == LeadPlayerOption.wishes)*/ attributeStr = 'wishes';

    
    const results = await db.getPool().query(queryStr.replace(/\{column\}/g,attributeStr),[]);

    if(results.rows.length == 0){
        throw 'No players found?';
    }

    return results.rows.map(function(row){
        return {
            title:row.username,
            amount:row[attributeStr],
        };
    })
}