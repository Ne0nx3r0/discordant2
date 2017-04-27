import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import PlayerCharacter from '../../../core/creature/player/PlayerCharacter';
import { TotalXPToLevel } from "../../../util/XPToLevel";

const queryStr = `
    UPDATE player 
    SET 
        level = 1,
        wishes = $2,
        attribute_strength = $3,
        attribute_agility = $4,
        attribute_vitality = $5,
        attribute_spirit = $6,
        attribute_charisma = $7,
        attribute_luck = $8
    WHERE uid = $1 AND wishes >= $9;
`;

const DBRespecPlayer = async function(db:DatabaseService,pc:PlayerCharacter,wishesNeeded:number,wishesToGrant:number):Promise<void>{
    const attributes = pc.class.startingAttributes;
    await db.getPool().query(queryStr,[
        pc.uid,
        wishesToGrant,
        attributes.strength,
        attributes.agility,
        attributes.vitality,
        attributes.spirit,
        attributes.charisma,
        attributes.luck,
        wishesNeeded,
    ]);
}

export default DBRespecPlayer;