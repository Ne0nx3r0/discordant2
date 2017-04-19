/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />
import Command from './Command';
import * as Commands from "./ActiveCommands";
import { PermissionRole } from '../core/permissions/PermissionService';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import PermissionsService from '../core/permissions/PermissionService';
import AllItems from '../core/item/AllItems';
import SocketClientRequester from '../client/SocketClientRequester';
import { SocketPvPInvite } from '../core/battle/PvPInvite';
import{
    Client as DiscordClient,
    Message,
    TextChannel,
    Guild,
    PermissionOverwrites
} from 'discord.js';
import Logger from "../gameserver/log/Logger";

export interface BotConfigBase{
    authToken:string;
    ownerUIDs:Array<string>;
    commandPrefix:string;
}

export interface BotConfig extends BotConfigBase{
    gameserver:string;
    production:boolean;
}

export interface BotBag extends BotConfigBase{
    socket:SocketClientRequester;
    permissions:PermissionsService;
    logger:Logger;
}

export default class DiscordantBotNode{
    client:DiscordClient;
    commandPrefix:string;
    ownerUIDs:Array<string>;
    commands:Map<String,Command>;
    lockdown:boolean;
    socket:SocketClientRequester;
    logger:Logger;
    permissions:PermissionsService;
    items: AllItems;
    aliases: Map<string,string>;

    constructor(bag:BotBag){
        this.lockdown = false;
        this.commandPrefix = bag.commandPrefix;
        this.ownerUIDs = bag.ownerUIDs;
        this.permissions = bag.permissions;
        this.items = new AllItems();
        this.aliases = new Map();

        this.logger = bag.logger;

        this.socket = bag.socket;

        this.getChannelById = this.getChannelById.bind(this);

        this.commands = new Map();

        Object.keys(Commands).forEach((commandName)=>{
            const command:Command = new Commands[commandName];

            this.commands.set(command.name.toUpperCase(),command);

            command.aliases.forEach((alias)=>{
                this.aliases.set(alias,command.name);
            });
        });

        this.client = new DiscordClient();

        this.client.on('ready',this.handleReady.bind(this));
        this.client.on('message',this.handleMessage.bind(this));

        this.client.login(bag.authToken);
    }

    handleReady(){
        let deleteChannelDelay = 2000;

        try{
            //Clean up any party channels
            this.client.channels.array()
            .forEach((channel:TextChannel,index:number)=>{
                if(channel.name && (channel.name.startsWith(this.commandPrefix+'pvp-') || channel.name.startsWith(this.commandPrefix+'party-'))){
                    deleteChannelDelay = deleteChannelDelay + 2000;

                    setTimeout(()=>{
                        try{
                            this.logger.info('Deleting channel '+channel.name);
                            
                            channel.delete();
                        }
                        catch(ex){
                            ex.msg = 'Error deleting channel';

                            this.logger.error(ex);
                        }
                    },deleteChannelDelay);
                }
            });
        }
        catch(ex){
            this.logger.error(ex);
        }
    }

    handleMessage(message:Message){
        //Ignore own messages
        if(message.author.id == this.client.user.id){
            return;
        }

        //Ignore non-prefix messages
        if(!message.content.startsWith(this.commandPrefix)){
            return;
        }

        const msgWithoutPrefix:string = message.content.substr(this.commandPrefix.length);
        const params:Array<string> = resolveArgs(msgWithoutPrefix);
        let commandName:string = params.shift();

        this.aliases.forEach(function(commandStr,alias){
            if(alias == commandName){
                commandName = commandStr;
            }
        });

        const command = this.commands.get(commandName.toUpperCase());

        if(!command){
            return;
        }

        (async ()=>{
            try{
                const playerUID = message.author.id;
                const playerRoleStr = await this.socket.getPlayerRole(playerUID);
                const playerRole:PermissionRole = this.permissions.getRole(playerRoleStr);

                if(this.lockdown && this.ownerUIDs.indexOf(playerUID) == -1){
                    message.channel.sendMessage(`Bot on lockdown, only owners may use commands.`);

                    return;
                }

                if(!playerRole.has(command.permissionNode) && this.ownerUIDs.indexOf(playerUID) == -1){
                    if(playerRole.title == 'anonymous'){
                        message.channel.sendMessage(`You can register with \`dbegin\``);
                    }
                    else{
                        message.channel.sendMessage(`You are not allowed to use this command, ${message.author.username}`);
                    }
                    return;
                }

                if(command.minParams > params.length){
                    message.channel.sendMessage(command.getUsage());

                    return;
                }

                await command.run({
                    socket: this.socket,
                    message: message,
                    params: params,
                    role: playerRole,
                    items: this.items,
                    commandPrefix: this.commandPrefix,
                    commands: this.commands,
                    handlers:{
                        setPlayingGame: this.setPlayingGame.bind(this),
                        createPvPChannel: this.createPvPChannel.bind(this),
                        createPartyChannel: this.createPartyChannel.bind(this),
                        deleteChannel: this.deleteChannel.bind(this),
                        setLockdown: this.setLockdown.bind(this),
                    },
                    permissions: this.permissions
                });
            }
            catch(errorMsg){
                message.channel.sendMessage(errorMsg+', '+message.author.username);
            }
        })();
    }

    setLockdown(lockdown:boolean){
        this.lockdown = lockdown;
    }

    setPlayingGame(msg:string){
        this.client.user.setGame(msg);
    }

    getChannelById(channelId:string):TextChannel{
        return this.client.channels.get(channelId) as TextChannel;
    }

    async createPvPChannel(guild:Guild,invite:SocketPvPInvite):Promise<TextChannel>{
        const channelname = (this.commandPrefix+'pvp-'+invite.sender.title.substr(0,invite.sender.title.length/2)+invite.receiver.title.substr(invite.receiver.title.length/2))
            .replace(/[^A-Za-z0-9-]+/g,'')
            .substr(0,20);

        const overwrites = [     
            {
                id: guild.id, 
                type: 'role', 
                deny: 0x00000800/*send_msg*/ + 0x00001000/*send_tts*/, 
                allow: 0x00000400/*read_msgs*/ + 0x00000040/*reactions*/,
                //Need these strictly for typescript
                channel: null,
                delete: null,
            } as PermissionOverwrites
        ];

        const channel:TextChannel = await guild.createChannel(channelname,'text',overwrites) as TextChannel;

        await channel.overwritePermissions(this.client.user.id,{
            SEND_MESSAGES: true
        });

        await channel.overwritePermissions(invite.sender.uid,{
            SEND_MESSAGES: true
        });

        await channel.overwritePermissions(invite.receiver.uid,{
            SEND_MESSAGES: true
        });

        return channel;
    }

    async createPartyChannel(guild:Guild,partyName:string,leaderUid:string):Promise<TextChannel>{
        const channelname = (this.commandPrefix+'party-'+partyName)
            .replace(/[^A-Za-z0-9-]+/g,'')
            .substr(0,20);

        const overwrites = [     
            {
                id: guild.id, 
                type: 'role', 
                 deny: 0x00000400, 
                allow: 0x00000000,
                //Need these strictly for typescript
                channel: null,
                delete: null,
            } as PermissionOverwrites
        ];

        const channel:TextChannel = await guild.createChannel(channelname,'text',overwrites) as TextChannel;

        await channel.overwritePermissions(this.client.user.id,{
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
        });

        await channel.overwritePermissions(leaderUid,{
            READ_MESSAGES: true,
            SEND_MESSAGES: true,
        });

        return channel;
    }

    deleteChannel(channelId:string){
        const channel = this.getChannelById(channelId);

        if(channel){
            channel.delete();
        }
    }
}

function resolveArgs(msg:string){
    let regex = /("([^"]+)")|('([^']+)')|\S+/g,
        matches = [],
        match;

    while((match = regex.exec(msg)) !== null) matches.push(match[4] || match[2] || match[0]);

    return matches;
}