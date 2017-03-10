/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

import Winston from 'winston';
import Command from './Command';
import * as Commands from "./ActiveCommands";
import { PermissionRole } from '../core/permissions/PermissionService';
import PermissionsService from '../core/permissions/PermissionService';
import SocketClient from '../client/SocketClient';

import{
    Client as DiscordClient,
    Message,
    TextChannel
} from 'discord.js';

export interface BotConfig{
    authToken:string;
    ownerUIDs:Array<string>;
    commandPrefix:string;
    permissions:PermissionsService;
    socket:SocketClient;
}

export default class DiscordantBotNode{
    client:DiscordClient;
    commandPrefix:string;
    ownerUIDs:Array<string>;
    commands:Map<String,Command>;
    socket:SocketClient;
    permissions:PermissionsService;
    cachedRoles:Map<string,PermissionRole>;

    constructor(bag:BotConfig){
        this.commandPrefix = bag.commandPrefix;
        this.ownerUIDs = bag.ownerUIDs;
        this.permissions = bag.permissions;
        this.socket = bag.socket;
        this.cachedRoles = new Map();

        Object.keys(Commands).forEach((commandName)=>{
            const command:Command = new Commands[commandName];

            this.commands.set(command.name.toUpperCase(),command);
        });

        this.client = new DiscordClient();

        this.client.on('ready',this.handleReady.bind(this));
        this.client.on('message',this.handleMessage.bind(this));
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
        const commandName:string = params.shift();

        const command = this.commands.get(commandName.toUpperCase());

        if(!command){
            return;
        }

        try{
            (async ()=>{
                let playerUID = message.author.id;
                let playerRole:PermissionRole = this.cachedRoles.get(playerUID);

                if(!playerRole){
                    const playerRoleStr:string = await this.socket.getPlayerRole(playerUID);

                    playerRole = this.permissions.getRole(playerRoleStr);
                }

                if(!playerRole.has(command.permissionNode)){
                    message.channel.sendMessage(`You are not allowed to use this command, ${message.author.username}`);

                    return;
                }

                command.run({
                    socket: this.socket
                });
            })();
        }
        catch(ex){
            console.log(ex);

            message.channel.sendMessage(`An unexpected error occurred, ${message.author.username}`);
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