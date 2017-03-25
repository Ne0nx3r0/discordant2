import PermissionId from '../core/permissions/PermissionId';
import { Message, Guild, TextChannel } from 'discord.js';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import { PermissionRole } from '../core/permissions/PermissionService';
import AllItems from '../core/item/AllItems';
import PermissionsService from '../core/permissions/PermissionService';
import SocketClientRequester from '../client/SocketClientRequester';
import { SocketPvPInvite } from '../core/battle/PvPInvite';

export interface SetPlayingFunc{
    (msg:string):void;
}

export interface CreatePvPChannelFunc{
    (guild:Guild,invite:SocketPvPInvite):TextChannel;
}

export interface BotHandlers{
    setPlayingGame: SetPlayingFunc;
    createPvPChannel: CreatePvPChannelFunc;
}

export interface CommandRunBag{
    message: Message;
    params: Array<string>;
    role: PermissionRole;
    items:AllItems;
    commandPrefix:string;
    commands:Map<String,Command>;
    socket: SocketClientRequester;
    handlers: BotHandlers;
    permissions: PermissionsService;
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
    aliases:Array<string>;

    constructor(bag:CommandBag){
        this.name = bag.name;
        this.description = bag.description;
        this.usage = bag.usage;
        this.permissionNode = bag.permissionNode;
        this.minParams = bag.minParams;
        this.aliases = [];
    }

    getUsage(){
        return 'Usage: '+ this.usage;
    }

    getEmbed(msg:string,color?:number){
        return {
            embed: {
                color: color || 0xFF6347, 
                description: msg,           
            }
        }
    }

    async run(bag:CommandRunBag):Promise<void>{
        throw this.name+' does not properly implment run(bag:CommandRunBag)';
    }
}