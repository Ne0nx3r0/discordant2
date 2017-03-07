import DatabaseService from '../DatabaseService';
import { SocketPlayerInventoryItem } from '../../../core/socket/SocketRequests';

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

export default async function(db:DatabaseService,uid:string){
    const result = await this.db.getPool().query(getPlayerQuery,[uid]);

    if(result.rows.length == 0){
        return null;
    }
    
    const row = result.rows[0];

    const inventory:Array<SocketPlayerInventoryItem> = [];

    if(row.inventory){
        row.inventory.forEach((item:DBInventoryItem)=>{
            inventory.push({
                id:item.item_id,
                metadata:item.item_metadata,
                
            }):
            .set(item.item_id,new InventoryItem(this.items.get(item.item_id),item.amount));
        });
    }

    const pcInventory = new PlayerInventory(inventory);
    
    const equipment = {};

    if(row.equipment){
        row.equipment.forEach((item:DBEquipmentItem)=>{
            equipment[item.slot] = this.items.get(item.item_id);
        });
    }

    const pcEquipment = new CreatureEquipment(equipment);

    //create a new cached entry
    if(!cachedPlayer){
        cachedPlayer = new PlayerCharacter({
            id: row.id,
            uid: uid,
            discriminator: row.discriminator,
            description: row.description,
            title: row.username,
            xp: row.xp,
            wishes: row.wishes,
            class: CharacterClasses.get(row.class),
            attributes: new AttributeSet(
                row.attribute_strength,
                row.attribute_agility,
                row.attribute_vitality,
                row.attribute_spirit,
                row.attribute_luck
            ),
            equipment: pcEquipment,
            inventory: pcInventory,
            role: this.permissions.getRole(row.role),
            karma: row.karma
        });

        this.cachedPlayers.set(cachedPlayer.uid,cachedPlayer);
    }
    //Update existing entry
    else{
        cachedPlayer.description = row.description;
        cachedPlayer.title = row.username;
        cachedPlayer.xp = row.xp;
        cachedPlayer.wishes = row.wishes;
        cachedPlayer.class = CharacterClasses.get(row.class);
        cachedPlayer.attributes.Strength = row.attribute_strength;
        cachedPlayer.attributes.Agility = row.attribute_agility;
        cachedPlayer.attributes.Vitality = row.attribute_vitality;
        cachedPlayer.attributes.Spirit = row.attribute_spirit;
        cachedPlayer.attributes.Luck = row.attribute_luck;
        cachedPlayer.equipment = pcEquipment;
        cachedPlayer.inventory = pcInventory;
        cachedPlayer.role = row.role;
        cachedPlayer.karma = row.karma;
    }

    return cachedPlayer;
}