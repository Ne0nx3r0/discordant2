import PermissionId from '../core/permissions/PermissionId';
import SocketClient from '../client/SocketClient';
import {Message} from 'discord.js';

export interface CommandRunBag{
    socket:SocketClient;
    message:Message;
    params:Array<string>;
    playerUID:string;
}

export interface CommandBag{
    name:string;
    description:string;
    usage:string;
    permissionNode:PermissionId;
}

export default class Command{
    name:string;
    description:string;
    usage:string;
    permissionNode:PermissionId;

    constructor(bag:CommandBag){
        this.name = bag.name;
        this.description = bag.description;
        this.usage = bag.usage;
        this.permissionNode = bag.permissionNode;
    }

    run(bag:CommandRunBag){
        throw this.name+' does not properly implment run(bag:CommandRunBag)';
    }
}