import AttributeSet from '../creature/AttributeSet';
import { EquipmentSlot } from '../creature/EquipmentSlot';

//request goes from client to server with a response
export type SocketRequestType = 'GetPlayerRole';

//push goes from server to client
export type SocketPushType = 'PlayerRoleUpdated';

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

//Request pairs

export interface SocketRequest{
    response?:{
        success?:boolean;
        error?:string;
    };
}

export interface GetPlayerRoleResponse{
    role:string;
}

export interface GetPlayerRoleByUIDRequest extends SocketRequest{
    uid: string;
//filled in by response
    response?:GetPlayerRoleResponse;
}

//Server to client pushes

export interface PlayerRoleUpdatedPush{
    playerUid:string;
    newRole:string;
}