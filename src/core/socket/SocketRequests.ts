import AttributeSet from '../creature/AttributeSet';
import { EquipmentSlot } from '../creature/EquipmentSlot';

//Reusable interfaces
/*
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

export interface SocketPlayer{
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

export interface SocketResponse{
    success:boolean;
    error?:string;
    payload:any;
}*/

export interface SocketResponse{
    success:boolean;
    error?:string;
}

export interface SocketRequest{
    response?:SocketResponse;
}

//Server to client pushes

export interface PlayerRoleUpdatedPush{
    playerUid:string;
    newRole:string;
}