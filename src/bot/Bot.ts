/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

import Winston from 'winston';
import Command from './Command';
import * as Commands from "./ActiveCommands";
import { PermissionRole } from '../core/permissions/PermissionService';
import { SocketPlayerCharacter } from '../core/creature/player/PlayerCharacter';
import PermissionsService from '../core/permissions/PermissionService';
import AllItems from '../core/item/AllItems';
import SocketClientRequester from '../client/SocketClientRequester';

import{
    Client as DiscordClient,
    Message,
    TextChannel
} from 'discord.js';

export interface BotConfigBase{
    authToken:string;
    ownerUIDs:Array<string>;
    commandPrefix:string;
}

export interface BotConfig extends BotConfigBase{
    gameserver:string;
}

export interface BotBag extends BotConfigBase{
    socket:SocketClientRequester;
    permissions:PermissionsService;
}

export default class DiscordantBotNode{
    client:DiscordClient;
    commandPrefix:string;
    ownerUIDs:Array<string>;
    commands:Map<String,Command>;
    socket:SocketClientRequester;
    permissions:PermissionsService;
    items: AllItems;
    aliases: Map<string,string>;

    constructor(bag:BotBag){
        this.commandPrefix = bag.commandPrefix;
        this.ownerUIDs = bag.ownerUIDs;
        this.permissions = bag.permissions;
        this.items = new AllItems();
        this.aliases = new Map();

        this.socket = bag.socket;

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
            .forEach(function(channel:TextChannel,index:number){
                if(channel.name && (channel.name.startsWith('dpvp-') || channel.name.startsWith('dparty-'))){
                    deleteChannelDelay = deleteChannelDelay + 2000;

                    setTimeout(function(){
                        try{
                            Winston.info('Deleting channel '+channel.name);
                            
                            channel.delete();
                        }
                        catch(ex){
                            ex.msg = 'Error deleting channel';

                            Winston.error(ex);
                        }
                    },deleteChannelDelay);
                }
            });
        }
        catch(ex){
            Winston.error(ex);
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
                const playerRole:PermissionRole = await this.socket.getPlayerRole(playerUID);

                if((this.ownerUIDs.indexOf(playerUID) == -1)
                || !playerRole.has(command.permissionNode)){
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
                        setPlayingGame: this.setPlayingGame.bind(this)
                    },
                    permissions: this.permissions
                });
            }
            catch(errorMsg){
                message.channel.sendMessage(errorMsg+', '+message.author.username);
            }
        })();
    }

    setPlayingGame(msg:string){
        this.client.user.setGame(msg);
    }
}

function resolveArgs(msg:string){
    let regex = /("([^"]+)")|('([^']+)')|\S+/g,
        matches = [],
        match;

    while((match = regex.exec(msg)) !== null) matches.push(match[4] || match[2] || match[0]);

    return matches;
}