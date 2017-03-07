import AttributeSet from '../creature/AttributeSet';
import { EquipmentSlot } from '../creature/EquipmentSlot';

const socketRequest = {
    GET_PLAYER_BY_UID: 'getPlayerByUID'
};

export {socketRequest as SocketRequest};

//Reusable interfaces

export interface SocketPlayerInventoryItem{
    id:number;
    metadata:string;
    amount:number;
}

export interface SocketPlayerEquipmentItem{
    id:number;
    metadata:string;
    slot:EquipmentSlot;
}

export interface SocketResponse{
    success:boolean;
    error?:string;
}
//Request pairs

export interface GetPlayerByUIDRequest{
    uid: string;
}

export interface GetPlayerByUIDResponse extends SocketResponse{
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