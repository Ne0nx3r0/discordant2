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
    }

    async run(bag:CommandRunBag){
        const player = await bag.socket.getPlayer(bag.message.author.id);

        //Can't duel
        if(player.status != 'inCity'){
            bag.message.channel.sendMessage(`You cannot PvP right now, ${bag.message.author.username}`);

            return;
        }

        //Accepting a pending challenge
        if(bag.params[0] == 'accept' || bag.params[0] == 'a'){
            const invite:SocketPvPInvite = await bag.socket.getPvPInvite(player.uid);

            if(!invite){
                bag.message.channel.sendMessage('You do not have a pending invite, '+bag.message.author.username);

                return;
            }

            //It's time to D-D-D-D-D-D-D-D-duuuuel
            const channel:TextChannel = await bag.handlers.createPvPChannel(bag.message.guild,invite);

            const battle = bag.socket.createPvPBattle(invite,channel.id);

            bag.message.channel.sendMessage(`The duel between <@${invite.sender.uid}> and <@${invite.receiver.uid}> begins in 30 seconds in <#${channel.id}>`);

            return;
        }

        //Sending a challenge
        const tagUser = bag.message.mentions.users.first()
        
        if(!tagUser){
            bag.message.channel.sendMessage(this.getUsage());

            return;
        }

        //Will throw error if something goes wrong
        await bag.socket.createPvPInvite(bag.message.author.id,tagUser.id);

        bag.message.channel.sendMessage(`${bag.message.author.username} challenged ${tagUser} to a duel! (expires in 60 seconds)`);
    }
}