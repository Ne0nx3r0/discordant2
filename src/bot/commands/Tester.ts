import { CommandBag, CommandRunBag } from '../Command';
import Command from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import { BotConstants } from '../BotConstants';
export default class Tester extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'tester',
            description: 'Toggle tester role',
            usage: 'tester',
            permissionNode: PermissionId.Tester,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const hasTesterRole = bag.bot.client
        .guilds
        .get(BotConstants.SERVER_ID)
        .member(bag.message.author.id)
        .roles.has(BotConstants.ROLE_TESTER_ID);

        if(!hasTesterRole){
            bag.bot.addChatRole(bag.message.author.id,BotConstants.ROLE_TESTER_ID);

            bag.message.channel.send('Added you as a tester, '+bag.message.author.username);
        }
        else{
            bag.bot.revokeChatRole(bag.message.author.id,BotConstants.ROLE_TESTER_ID);

            bag.message.channel.send('Removed you as a tester, '+bag.message.author.username);
        }
    }
}