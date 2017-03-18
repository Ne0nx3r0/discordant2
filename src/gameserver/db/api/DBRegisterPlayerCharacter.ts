import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import CharacterClass from '../../../core/creature/player/CharacterClass';
import GetPlayer from './DBGetPlayerCharacter';

export interface DBRegisterbag{
    uid: string;
    username:string;
    discriminator: string;
    class: CharacterClass;
}

export default async function(db:DatabaseService,bag:DBRegisterbag):Promise<DBPlayer>{
    const existingPlayer = await GetPlayer(db,bag.uid);

    if(existingPlayer){
        throw 'You are already registered';
    }

    const insertPlayerQuery = `
        INSERT INTO player (
                uid,
                discriminator,
                username,
                class,
                attribute_strength,
                attribute_agility,
                attribute_vitality,
                attribute_spirit,
                attribute_charisma,
                attribute_luck,
                role
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);
    `;

    const insertPlayerParams:Array<any> = [
        bag.uid,
        bag.discriminator,
        bag.username,
        bag.class.id,
        bag.class.startingAttributes.Strength,
        bag.class.startingAttributes.Agility,
        bag.class.startingAttributes.Vitality,
        bag.class.startingAttributes.Spirit,
        bag.class.startingAttributes.Charisma,
        bag.class.startingAttributes.Luck,
        'player'
    ];

    const queries:Array<any> = [
        {query: insertPlayerQuery, params: insertPlayerParams}
    ];
    
    if(bag.class.startingEquipment){
        const equipmentItems = [];

        let valuesStr = '';

        Object.keys(bag.class.startingEquipment._items).forEach((slot)=>{
            const item = bag.class.startingEquipment._items[slot];

            valuesStr += `,(${bag.uid},${item.id},'${slot}')`;
        });

        queries.push({
            query: 'INSERT INTO player_equipment_item(player_uid,item_id,slot) VALUES'
                +valuesStr.substr(1)
        });
    }

    const result = await db.runBatch(queries); 
    
    if(result.rowCount == 0){
        throw 'A database error occurred';
    }

    return await GetPlayer(db,bag.uid);
}