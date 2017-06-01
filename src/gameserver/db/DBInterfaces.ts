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