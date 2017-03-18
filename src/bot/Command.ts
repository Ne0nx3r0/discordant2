import PermissionId from '../core/permissions/PermissionId';
import SocketClient from '../client/SocketClient';
import {Message} from 'discord.js';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import { PermissionRole } from '../core/permissions/PermissionService';
import AllItems from '../core/item/AllItems';

export interface CommandRunBag{
    socket:SocketClient;
    message:Message;
    params:Array<string>;
    role:PermissionRole;
    items:AllItems;
}

export interface CommandBag{
    name:string;
    description:string;
    usage:string;
    permissionNode:PermissionId;
    minParams:number;
}

export default class Command{
    name:string;
    description:string;
    usage:string;
    permissionNode:PermissionId;
    minParams:number;

    constructor(bag:CommandBag){
        this.name = bag.name;
        this.description = bag.description;
        this.usage = bag.usage;
        this.permissionNode = bag.permissionNode;
        this.minParams = bag.minParams;
    }

    getUsage(){
        return 'Usage: '+ this.usage;
    }

    run(bag:CommandRunBag){
        throw this.name+' does not properly implment run(bag:CommandRunBag)';
    }
}