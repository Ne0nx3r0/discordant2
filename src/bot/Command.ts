import PermissionId from '../core/permissions/PermissionId';
import { Message, Guild, TextChannel } from 'discord.js';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import { PermissionRole } from '../core/permissions/PermissionService';
import AllItems from '../core/item/AllItems';
import PermissionsService from '../core/permissions/PermissionService';
import SocketClientRequester from '../client/SocketClientRequester';
import { SocketPvPInvite } from '../core/battle/PvPInvite';

const UserTagRegex = new RegExp(/<@([0-9]{18})>/);
const UserUidRegex = new RegExp(/([0-9]{18})/);

export interface SetPlayingFunc{
    (msg:string):void;
}

export interface DeleteChannelFunc{
    (channelId:string):void;
}

export interface BotHandlers{
    setPlayingGame: SetPlayingFunc;
    createPvPChannel(guild:Guild,invite:SocketPvPInvite):TextChannel;
    createPartyChannel(guild:Guild,partyName:string,leaderUid:string):TextChannel;
    setLockdown(lockdown:boolean):void;
    deleteChannel: DeleteChannelFunc;
    logout():void;
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
    aliases:Map<string,string>;

    constructor(bag:CommandBag){
        this.name = bag.name;
        this.description = bag.description;
        this.usage = bag.usage;
        this.permissionNode = bag.permissionNode;
        this.minParams = bag.minParams;
        this.aliases = new Map();
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

    getUserTagId(bagParam:string):string{
        if(UserTagRegex.test(bagParam)){
            return UserTagRegex.exec(bagParam)[1];
        }
 
        if(UserUidRegex.test(bagParam)){
            return UserUidRegex.exec(bagParam)[1];
        }

        return null;
    }

    async run(bag:CommandRunBag):Promise<void>{
        throw this.name+' does not properly implment run(bag:CommandRunBag)';
    }
}