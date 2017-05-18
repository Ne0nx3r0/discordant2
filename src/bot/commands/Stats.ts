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
        let tagUserId;
        
        if(bag.params.length == 0){
            tagUserId = bag.message.author.id;
        }
        else{
            tagUserId = this.getUserTagId(bag.params[0]);
        }

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
         +pc.stats.strength+' Strength,'
    +' '+pc.stats.agility+' Agility,'
    +'\n'+pc.stats.vitality+' Vitality,'
    +' '+pc.stats.spirit+' Spirit,'
    +'\n'+pc.stats.charisma+' Charisma,'
    +' '+pc.stats.luck+' Luck';

    const resistancesStr = ''
    +'\n'+Math.floor(pc.stats.resistances.physical*100)+'% Physical'
    +'\n'+Math.floor(pc.stats.resistances.fire*100)+'%'+' Fire'
    +'\n'+Math.floor(pc.stats.resistances.acid*100)+'%'+' Acid'
    +'\n'+Math.floor(pc.stats.resistances.thunder*100)+'% Thunder';

    function getEquipmentInSlot(slot:string){
        if(pc.equipment[slot]){
            return '\n'+items.get(pc.equipment[slot] as number).title+' ('+slot.substr(0,1).toUpperCase()+slot.substr(1)+')'; 
        }
        return '\n- ('+slot.substr(0,1).toUpperCase()+slot.substr(1)+')';
    }

    const equipmentStr = getEquipmentInSlot('hat')
    +getEquipmentInSlot('amulet')
    +getEquipmentInSlot('armor')
    +getEquipmentInSlot('ring')
    +getEquipmentInSlot('pouch');

    return {
        embed: {
            color: 3447003,
            author: {
                name: 'Stats for '+pc.title,
                icon_url: 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png'
            },
            description: pc.description?pc.description:'',
            fields: [
                {
                    name: 'Health Points',
                    value: pc.hpCurrent + ' / ' + pc.stats.hpTotal,
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
                    name: 'Magic Find',
                    value: pc.stats.magicFind,
                    inline: true,
                },
                {
                    name: 'Weapons',
                    value: `${items.get(pc.equipment.weapon || 0).title} (Primary)
${items.get(pc.equipment.offhand || 0).title} (Offhand)`,
                    inline: true,
                },
                {
                    name: 'Equipment',
                    value: equipmentStr,
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
                },
            ]
        }
    }
}