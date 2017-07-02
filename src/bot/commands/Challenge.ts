import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { TextChannel } from 'discord.js';
import { SocketPvPInvite } from '../../core/battle/PvPInvite';

export default class Challenge extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'challenge',
            description: 'Show your inventory',
            usage: 'challenge <@user|accept|deny>',
            permissionNode: PermissionId.Inventory,
            minParams: 1,
        });

        this.aliases.set('challengeaccept','challenge accept');
        this.aliases.set('challengedeny','challenge deny');
        this.aliases.set('caccept','challenge accept');
        this.aliases.set('cdeny','challenge deny');
    }

    async run(bag:CommandRunBag){
        if(1==1){
            throw 'Temporarily disabled';
        }
        //Accepting a pending challenge
        if(bag.params[0] == 'accept' || bag.params[0] == 'a'){
            const invite:SocketPvPInvite = await bag.socket.getPvPInvite(bag.message.author.id);

            if(!invite){
                bag.message.channel.send('You do not have a pending invite, '+bag.message.author.username);

                return;
            }

            //It's time to D-D-D-D-D-D-D-D-duuuuel
            const channel:TextChannel = await bag.bot.createPvPChannel(bag.message.guild,invite);

            try{
                await bag.socket.createPvPBattle(invite,channel.id);
            }
            catch(ex){
                bag.bot.deleteChannel(channel.id);

                throw ex;
            }

            bag.message.channel.send(`The duel between <@${invite.sender.uid}> and <@${invite.receiver.uid}> begins in 30 seconds in <#${channel.id}>`);

            return;
        }

        //Sending a challenge
        const tagUserId = this.getUserTagId(bag.params[0]);
        
        if(!tagUserId){
            bag.message.channel.send(this.getUsage());

            return;
        }

        if(tagUserId == bag.message.author.id){
            throw 'You cannot challenge yourself';
        }

        //Will throw error if something goes wrong
        await bag.socket.createPvPInvite(bag.message.author.id,tagUserId);

        bag.message.channel.send(`${bag.message.author.username} challenged <@${tagUserId}> to a duel! (expires in 60 seconds)

You can reply \`${bag.commandPrefix}caccept\` or \`${bag.commandPrefix}cdeny\``);
    }
}