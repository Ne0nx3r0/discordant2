/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

const Discord = require('discord.js');

import{
    Client as DiscordClient
} from 'discord.js';

export default class DiscordantBotNode{
    client:DiscordClient;

    constructor(){
        this.client = new Discord.Client();
    }
}