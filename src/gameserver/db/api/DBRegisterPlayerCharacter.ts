import DatabaseService from '../DatabaseService';
import InventoryItem from '../../../core/item/InventoryItem';
import { EquipmentSlot } from '../../../core/item/CreatureEquipment';
import { DBPlayer } from '../DBInterfaces';
import CharacterClass from '../../../core/creature/player/CharacterClass';
import GetPlayer from './DBGetPlayerCharacter';


const registerPlayerQuery = `
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

export interface DBRegisterPlayerBag{
    uid: string;
    username:string;
    discriminator: string;
    class: CharacterClass;
}

export default async function(db:DatabaseService,bag:DBRegisterPlayerBag):Promise<DBPlayer>{
    const result = await db.getPool().query(registerPlayerQuery,[
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
    ]);

    if(result.rowCount == 1){
        return await GetPlayer(db,bag.uid);
    }

    return null;
}