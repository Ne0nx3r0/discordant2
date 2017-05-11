import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import { SocketPlayerParty } from "../../core/party/PlayerParty";

export default class Party extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'party',
            description: 'Shows your current party status',
            usage: 'party',
            permissionNode: PermissionId.Party,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const party:SocketPlayerParty = await bag.socket.getPlayerParty(bag.message.author.id);

        if(!party){
            bag.message.channel.sendMessage(`You are not in a party right now, ${bag.message.author.username}`);
            return;
        }

        let partyMagicFind = party.leader.stats.magicFind;

        const members = party.members.map(function(member){
            partyMagicFind += member.stats.magicFind;
            
            return `${member.title} (${member.hpCurrent} / ${member.stats.hpTotal})`;
        }).join('\n');

        bag.message.channel.sendMessage(`${party.title} in <#${party.channel}>
Leader: ${party.leader.title} (${party.leader.hpCurrent} / ${party.leader.stats.hpTotal})
Members: ${members}
Total Magic Find: ${partyMagicFind}
`);
    }
}