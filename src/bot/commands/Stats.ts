import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import PlayerCharacter from '../../core/creature/player/PlayerCharacter';
import { MessageOptions } from "discord.js";
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';

export default class Begin extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'stats',
            description: 'Check stats',
            usage: 'stats [\@user]',
            permissionNode: PermissionId.Stats
        });
    }

    run(bag:CommandRunBag){
        (async()=>{
            try{
                if(bag.params.length == 0){
                    const player = await bag.socket.getPlayer(bag.message.author.id);

                    bag.message.channel.sendMessage("",getEmbed(player) as MessageOptions);

                    return;
                }

                const tagUserId = bag.message.mentions.users.first().id;

                if(!tagUserId){
                    bag.message.channel.sendMessage(this.getUsage());

                    return;
                }

                const otherPlayer = await bag.socket.getPlayer(tagUserId);

                bag.message.channel.sendMessage("",getEmbed(otherPlayer) as MessageOptions);
            }
            catch(ex){
                bag.message.channel.sendMessage(`${ex}, ${bag.message.author.username}`);
            }
        })();
    }
}

function getEmbed(pc:SocketPlayerCharacter){
    const pcAttributesStr = ''
    +'\n'+pc.stats.Strength+' Strength'
    +'\n'+pc.stats.Agility+' Agility'
    +'\n'+pc.stats.Vitality+' Vitality'
    +'\n'+pc.stats.Spirit+' Spirit'
    +'\n'+pc.stats.Charisma+' Charisma'
    +'\n'+pc.stats.Luck+' Luck';

    const resistancesStr = ''
    +'\n'+(pc.stats.Resistances.Physical*100)+'% Physical'
    +'\n'+(pc.stats.Resistances.Fire*100)+'%'+' Fire'
    +'\n'+(pc.stats.Resistances.Cold*100)+'%'+' Cold'
    +'\n'+(pc.stats.Resistances.Thunder*100)+'% Thunder';

    return {
        embed: {
            color: 3447003,
            author: {
                name: 'Stats for '+pc.title,
                icon_url: 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png'
            },
            description: 'description here '+pc.description,
            fields: [
                {
                    name: 'Health Points',
                    value: pc.HPCurrent + ' / ' + pc.stats.HPTotal,
                    inline: true,
                },
                {
                    name: 'Experience',
                    value: pc.xp,
                    inline: true,
                },
                {
                    name: 'Wishes',
                    value: pc.wishes,
                    inline: true,
                },                
                {
                    name: 'Karma',
                    value: pc.karma,
                    inline: true,
                },
                /*{
                    name: 'Primary Weapon',
                    value: pc.equipment.primaryweapon.title,
                    inline: true,
                },
                {
                    name: 'Offhand Weapon',
                    value: pc.equipment.offhandweapon.title,
                    inline: true,
                },
                {
                    name: 'Class',
                    value: pc.class.title,
                    inline: true,
                },*/
                {
                    name: 'Attributes',
                    value: pcAttributesStr,
                    inline: true,
                },
                {
                    name: 'Resistances',
                    value: resistancesStr,
                    inline: true,
                }
            ]
        }
    }
}