import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';

export default class PartyMap extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'partymap',
            description: '(while exploring in a party) sends the current party map location',
            usage: 'partymap',
            permissionNode: PermissionId.PartyMap,
            minParams: 0,
        });

        this.aliases.set('pmap','partymap');
    }

    async run(bag:CommandRunBag){
        const pc = await bag.socket.getPlayer(bag.message.author.id);

        if(!pc.partyChannelId){
            throw 'You are not in a party';
        }

        if(pc.partyChannelId != bag.message.channel.id){
            throw 'Your party is at <#'+pc.partyChannelId+'>';
        }

        await bag.socket.sendPartyMapImage(
            bag.message.author.id
        );        
    }
}