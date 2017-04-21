import Command from '../Command';
import { CommandBag, CommandRunBag } from '../Command';
import PermissionId from '../../core/permissions/PermissionId';
import CharacterClass from '../../core/creature/player/CharacterClass';
import CharacterClasses from '../../core/creature/player/CharacterClasses';
import PlayerCharacter from '../../core/creature/player/PlayerCharacter';
import { MessageOptions } from "discord.js";
import { SocketPlayerCharacter } from '../../core/creature/player/PlayerCharacter';
import AllItems from '../../core/item/AllItems';
import { XPToLevel } from "../../util/XPToLevel";

export default class Begin extends Command{
    constructor(bag:CommandBag){
        super({
            name: 'stats',
            description: 'Check stats',
            usage: 'stats [\@user]',
            permissionNode: PermissionId.Stats,
            minParams: 0,
        });
    }

    async run(bag:CommandRunBag){
        const tagUserId = this.getUserTagId(bag.params[0]);

        if(!tagUserId){
            bag.message.channel.sendMessage(this.getUsage());
            
            return;
        }

        const player = await bag.socket.getPlayer(tagUserId);

        if(!player){
            throw 'Player not found';
        }

        bag.message.channel.sendMessage("",getEmbed(player,bag.items) as MessageOptions);
    }
}

function getEmbed(pc:SocketPlayerCharacter,items:AllItems){
    const pcAttributesStr = ''
    +'\n'+pc.stats.Strength+' Strength'
    +'\n'+pc.stats.Agility+' Agility'
    +'\n'+pc.stats.Vitality+' Vitality'
    +'\n'+pc.stats.Spirit+' Spirit'
    +'\n'+pc.stats.Charisma+' Charisma'
    +'\n'+pc.stats.Luck+' Luck';

    const resistancesStr = ''
    +'\n'+Math.floor(pc.stats.Resistances.Physical*100)+'% Physical'
    +'\n'+Math.floor(pc.stats.Resistances.Fire*100)+'%'+' Fire'
    +'\n'+Math.floor(pc.stats.Resistances.Cold*100)+'%'+' Cold'
    +'\n'+Math.floor(pc.stats.Resistances.Thunder*100)+'% Thunder';

    const characterClass = CharacterClasses.get(pc.class);

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
                    name: 'Level',
                    value: pc.level,
                    inline: true,
                },
                {
                    name: 'Wishes',
                    value: `${pc.wishes} / ${XPToLevel[pc.level]}`,
                    inline: true,
                },
                {
                    name: 'Gold',
                    value: pc.gold,
                    inline: true,
                },                
                {
                    name: 'Karma',
                    value: pc.karma,
                    inline: true,
                },
                {
                    name: 'Primary Weapon',
                    value: items.get(pc.equipment.weapon || 0).title,
                    inline: true,
                },
                {
                    name: 'Offhand Weapon',
                    value: items.get(pc.equipment.offhand || 0).title,
                    inline: true,
                },
                {
                    name: 'Class',
                    value: characterClass.title,
                    inline: true,
                },
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