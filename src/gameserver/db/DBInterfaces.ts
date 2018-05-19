import { EquipmentSlot } from '../../core/item/CreatureEquipment';

export interface DBPlayer{
    uid: string;
    discriminator: string;
    username: string;
    description: string;
    gold: number;
    level: number;
    wishes: number;
    class: number;
    karma: number;
    role: string;
    attribute_strength: number;
    attribute_agility: number;
    attribute_vitality: number;
    attribute_spirit: number;
    attribute_luck: number;
    inventory:Array<DBInventoryItem>;
    equipment:Array<DBEquipmentItem>;
    last_daily: number;
    metadata: any;
    stalls: number;
    active_pet_id: number;
    pets: DBPlayerPet[];
}

export interface DBPlayerPet{
    id: string;
    stall: number;
    catcher_uid: string;
    owner_uid: string;
    level: number;
    base_id: number;
    title: string;
    loyalty: number;
    attribute_strength: number;
    attribute_agility: number;
    attribute_vitality: number;
    attribute_spirit: number;
    attribute_luck: number;
    personality_id: number;
    attack1: number;
    attack2: number;
    attack3: number;
    attack4: number;
}

export interface DBEquipmentItem{
    player_uid:string;
    item_id:number;
    slot:EquipmentSlot;
}

export interface DBInventoryItem{
    player_uid:string;
    item_id:number;
    amount:number;
}