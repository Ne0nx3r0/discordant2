import AttributeSet from '../creature/AttributeSet';
import { EquipmentSlot } from '../creature/EquipmentSlot';

const socketRequest = {
    GET_PLAYER_BY_UID: 'getPlayerByUID'
};

export {socketRequest as SocketRequest};

//Reusable interfaces

interface SocketPlayerInventoryItem{
    id:number;
    metadata:string;
    amount:number;
}

interface SocketPlayerEquipmentItem{
    id:number;
    metadata:string;
    slot:EquipmentSlot;
}

//Request pairs

export interface GetPlayerByUIDRequest{
    uid: string;
}
export interface GetPlayerByUIDResponse{
    success:boolean;
    player:{
        uid:string;
        title:string;
        discriminator:string;
        xp:number;
        wishes:number;
        class:number;
        attributes:AttributeSet;
        role:string;
        karma:number;
        inventory:Array<SocketPlayerEquipmentItem>;
        equipment:Array<SocketPlayerEquipmentItem>;
    }
}