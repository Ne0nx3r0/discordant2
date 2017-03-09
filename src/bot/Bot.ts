/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

import Winston from 'winston';

import{
    Client as DiscordClient,
    Message,
    TextChannel
} from 'discord.js';

export interface BotConfig{
    authToken:string;
    ownerUIDs:Array<string>;
    commandPrefix:string;
}

export default class DiscordantBotNode{
    client:DiscordClient;
    commandPrefix:string;
    ownerUIDs:Array<string>;

    constructor(bag:BotConfig){
        this.commandPrefix = bag.commandPrefix;
        this.ownerUIDs = bag.ownerUIDs;

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

        
    }
}