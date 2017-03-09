import PermissionId from './permissions/PermissionId';
import SocketClient from '../client/SocketClient';

export interface CommandRunBag{
    player:;
    socket:SocketClient;
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